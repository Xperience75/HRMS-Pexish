import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

type ApiHandlerContext = any;

type ApiHandler = (
  req: NextRequest,
  context?: ApiHandlerContext
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware Wrapper to enforce Audit Logging on POST/PUT/DELETE
 * Rule: Every POST/PUT/DELETE request must middleware-trigger an insert to Audit_Logs before returning 200 OK.
 */
export function withAuditLog(handler: ApiHandler, actionPrefix: string) {
  return async (req: NextRequest, context?: ApiHandlerContext) => {
    if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      return handler(req, context);
    }

    try {
      // 1. Fetch User/Tenant context (Simulated auth state via headers or cookies)
      const tenantId = req.headers.get("x-tenant-id"); 
      const actorUserId = req.headers.get("x-user-id");
      const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

      if (!tenantId || !actorUserId) {
        return NextResponse.json({ error: "Unauthorized: Missing identity headers for Audit." }, { status: 401 });
      }

      // 2. We clone the request so we can extract the body for the Audit Log
      // Next.js consumes the Request stream upon .json(), so we MUST pass clonedReq to the hander
      // and keep the original for our Audit payload
      const handlerReq = req.clone() as unknown as NextRequest;
      let requestPayload = undefined;
      try {
        if (req.method !== "DELETE") {
          requestPayload = await req.json();
        }
      } catch (e) {
        // Ignored
      }

      // 3. Execute original handler. It works seamlessly using handlerReq.
      const response = await handler(handlerReq, context);

      // 4. Capture the Target Entity ID, usually returned in the response headers or body
      // Next.js response bodies are locked unless cloned.
      const auditRes = response.clone();
      let responseData: any = {};
      try {
        responseData = await auditRes.json();
      } catch (e) { }

      const targetEntityId = responseData?.id || response.headers.get("X-Target-Entity-Id") || "UNKNOWN_ENTITY";

      // 5. Fire the Audit Log if successful
      if (response.status >= 200 && response.status < 300) {
        const actionType = `${req.method}_${actionPrefix}`;
        
        await prisma.auditLog.create({
          data: {
            tenantId,
            actorUserId,
            targetEntityId,
            actionType,
            previousData: req.method !== "POST" ? { message: "Simulated previous state." } : undefined,
            newData: req.method !== "DELETE" ? requestPayload : undefined,
            ipAddress,
          },
        });
      }

      return response;

    } catch (error) {
      console.error("Audit Wrapper Error:", error);
      return NextResponse.json({ error: "Internal Server Error during Audit." }, { status: 500 });
    }
  };
}
