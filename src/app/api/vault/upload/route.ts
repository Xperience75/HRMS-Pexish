import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const tenantId = "mock-tenant-id"; // Current Active Tenant Context

    const formData = await req.formData();
    const templateName = formData.get("templateName") as string;
    const documentCategory = formData.get("documentCategory") as string;
    const rolesStr = formData.get("roles") as string;
    const file = formData.get("file") as File;

    if (!templateName || !documentCategory || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const applicableRoles = rolesStr ? JSON.parse(rolesStr) : [];
    
    // Emulate S3 Upload
    const fileBuffer = await file.arrayBuffer();
    // In production: const s3Result = await s3.upload({ Body: fileBuffer, ... }).promise();
    const storageUrl = `https://mock-s3-bucket.amazonaws.com/${tenantId}/${Date.now()}_${file.name}`;

    let normalizedType = documentCategory.toUpperCase();
    if (normalizedType === "JOB_DESCRIPTION") normalizedType = "JD";
    if (normalizedType === "POLICY_SOP") normalizedType = "POLICY";

    const newDocumentId = crypto.randomUUID();

    // "Construct the Prisma transaction. Insert a new record into the TemplateDocument schema linking the S3 storageUrl and the relational Role IDs."
    const template = await prisma.$transaction(async (tx) => {
      return await tx.templateDocument.create({
        data: {
          id: newDocumentId, // Explicitly pass the generated ID
          name: templateName,
          type: normalizedType as any,
          storageUrl: storageUrl,
          tenantId: tenantId,
          parsedTags: applicableRoles
        }
      });
    });

    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error: any) {
    console.error("S3 Upload Pipeline Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload template" }, { status: 500 });
  }
}
