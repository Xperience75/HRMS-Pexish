import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // Simulate reading the file, jobId, tenantId
    const file = formData.get("file");
    const jobId = formData.get("jobId") as string;
    const tenantId = formData.get("tenantId") as string;

    if (!file || !jobId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields (file, jobId, tenantId)" },
        { status: 400 }
      );
    }

    // Step 1: Mock OCR Extraction from the file
    const extractedData = {
      fullName: "Jane Doe",
      email: "jane.doe" + Math.floor(Math.random() * 1000) + "@example.com", // Randomize to allow testing
      nin: "NIN-" + Math.floor(Math.random() * 90000 + 10000), // Mock NIN
      skills: ["React", "TypeScript", "Node.js"]
    };

    // Note: We'll intentionally allow some known values to test the blacklist
    // In actual implementation, we might get these from parsing the CV.
    const testEmail = formData.get("email") as string;
    const testNin = formData.get("nin") as string;
    
    if (testEmail) extractedData.email = testEmail;
    if (testNin) extractedData.nin = testNin;

    // TARGET 2 Logic Block: The Blacklist Firewall
    const blacklistMatch = await prisma.blacklistVault.findFirst({
      where: {
        tenantId,
        OR: [
          { email: extractedData.email },
          { nin: extractedData.nin }
        ]
      }
    });

    if (blacklistMatch) {
      return NextResponse.json(
        { error: "Candidate Blacklisted. Do Not Hire." },
        { status: 403 }
      );
    }

    // Step 2: Match Score Simulation
    const matchScore = Math.floor(Math.random() * 100); // e.g., 85
    let stage: "SCREENED" | "REJECTED" = "SCREENED";
    
    if (matchScore < 45) {
      stage = "REJECTED";
    }

    // Step 3: Insert Candidate Form
    const candidate = await prisma.candidate.create({
      data: {
        tenantId,
        jobId,
        fullName: extractedData.fullName,
        email: extractedData.email,
        nin: extractedData.nin,
        matchScore,
        stage,
      }
    });

    return NextResponse.json({
      success: true,
      message: "CV Parsed and Evaluated successfully",
      data: candidate
    }, { status: 201 });

  } catch (error) {
    console.error("ATS Parse File Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
