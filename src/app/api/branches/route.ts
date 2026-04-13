import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuditLog } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

// Example Controller Logic to Create a Branch
async function createBranchHandler(req: NextRequest) {
  try {
    const data = await req.json();

    const tenantId = req.headers.get("x-tenant-id");

    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized: Missing Tenant ID" }, { status: 401 });
    }

    const { name, location, dataInheritanceLinked } = data;

    // Validate request payload
    if (!name || !location) {
      return NextResponse.json({ error: "Missing required branch fields." }, { status: 400 });
    }

    // Insert Branch into PostgreSQL Database using Prisma
    const branch = await prisma.branch.create({
      data: {
        id: crypto.randomUUID(),
        tenantId,
        name,
        location,
        dataInheritanceLinked: dataInheritanceLinked ?? true,
        updatedAt: new Date(),
      },
    });

    // We attach the newly created branch ID to a custom header so the wrapper can easily extract it.
    // Ideally the wrapper intercepts the Response body, but header extraction is simple.
    const response = NextResponse.json(branch, { status: 201 });
    response.headers.set("X-Target-Entity-Id", branch.id);
    return response;

  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: "Failed to create branch." }, { status: 500 });
  }
}

// Example Controller Logic to Get Branches
export async function GET(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id");

  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const branches = await prisma.branch.findMany({
    where: { tenantId },
  });

  return NextResponse.json(branches, { status: 200 });
}

// Export the POST method protected by the rule-enforced audit log wrapper
export const POST = withAuditLog(createBranchHandler, "BRANCH_ACTION");

