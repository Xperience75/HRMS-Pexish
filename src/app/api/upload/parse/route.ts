import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Mock S3 Upload Hook
async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string, tenantId: string, context: 'cvs' | 'employee_docs') {
  // S3 Cryptographic Isolation conceptually represented by unique pathing:
  const securePath = `s3://enterprise-vault/${tenantId}/${context}/${Date.now()}_${fileName}`;
  
  console.log(`[S3 Storage Target] Pushing secure buffer to: ${securePath} (MIME: ${mimeType})`);
  
  // Simulate network upload
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    url: `https://s3.enterprise-hrms.com/${tenantId}/${context}/${Date.now()}_${fileName}`
  };
}

// -----------------------------------------------------------------------------
// The Parser Webhook Simulation (simulateOcrParse)
// -----------------------------------------------------------------------------
async function simulateOcrParse(s3Url: string) {
  console.log(`[AI OCR Parser] Initiating analysis telemetry on ${s3Url}...`);
  // Simulate AI compute latency based on document complexity
  await new Promise(resolve => setTimeout(resolve, 1400));
  
  // Simulate standard JSON payload returned by an Enterprise OCR API (e.g., AWS Textract / Custom ML)
  return {
    success: true,
    extractedData: {
      firstName: "Alexander",
      lastName: "Thorne",
      email: "a.thorne@genesis.corp",
      nin: "84739281749",
      skills: ["React", "PostgreSQL", "Node.js", "Team Leadership"],
      matchScore: 92, // Strict 0-100% Fit Score
      confidence: 0.98
    }
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tenantId = formData.get('tenantId') as string;
    const documentContext = formData.get('context') as string || 'cvs';

    if (!file) {
      return NextResponse.json({ error: "No file buffer detected in payload." }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json({ error: "[Security] Missing tenant scope identifier." }, { status: 403 });
    }

    // 1. File Security: Extract Metadata
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB limit
    
    // Validate MIME Type
    if (!allowedMimeTypes.includes(file.type)) {
      console.warn(`[Security Alert] Rejected Mime Type Upload attempt: ${file.type}`);
      return NextResponse.json({ 
        error: "Invalid file format. Only PDF, JPG, and DOCX are authorized for structural integrity." 
      }, { status: 415 }); // 415 Unsupported Media Type
    }

    // Validate Cryptographic Size Constraints
    if (file.size > maxFileSize) {
      console.warn(`[Security Alert] Payload too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return NextResponse.json({ 
        error: "Payload size exceeds organizational threshold (MAX: 5MB)." 
      }, { status: 413 }); // 413 Payload Too Large
    }

    // 2. Transcode / Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. S3 Push Hook
    const uploadResult = await uploadToS3(
      buffer, 
      file.name, 
      file.type, 
      tenantId, 
      documentContext as 'cvs' | 'employee_docs'
    );

    // 4. Webhook Pipeline: Fire NLP Extraction
    let parsedData = null;
    if (uploadResult.success) {
      const ocrResult = await simulateOcrParse(uploadResult.url);
      parsedData = ocrResult.extractedData;
    }

    // Return the sanitized JSON parameters back to the front-end forms / ATS backend state natively
    return NextResponse.json({ 
      success: true, 
      s3Url: uploadResult.url,
      parsedMetrics: parsedData,
      message: "Document secured and neural parsing sequence completed." 
    });

  } catch (error: any) {
    console.error("[Ingest Error] ", error);
    return NextResponse.json({ success: false, error: "Internal Engine Fault during parse." }, { status: 500 });
  }
}
