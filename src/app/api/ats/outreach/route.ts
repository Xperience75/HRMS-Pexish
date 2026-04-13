import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateId } = body;

    if (!candidateId) {
      return NextResponse.json(
        { error: "candidateId is required" },
        { status: 400 }
      );
    }

    // TARGET 3 Payload Integration: Omnichannel Outreach
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { JobRequisition: true }
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    if (!candidate.JobRequisition) {
        return NextResponse.json(
            { error: "Job Requisition not found for this candidate" },
            { status: 404 }
        );
    }

    const title = candidate.JobRequisition.title;

    // 1. WhatsApp Payload (Twilio schema mock)
    const whatsAppPayload = {
      to: `whatsapp:${candidate.nin || "+2347000000000"}`, // Fallback for mock
      from: "whatsapp:+14155238886", // Twilio sandbox number
      body: `Dear ${candidate.fullName}, your CV for ${title} is shortlisted. Please reply with your Expected Salary (Gross) and Resumption Availability.`
    };

    // 2. Email Payload (SendGrid schema mock)
    const emailPayload = {
      personalizations: [
        {
          to: [{ email: candidate.email }],
          subject: `Shortlisted: Pre-Interview Questionnaire for ${title}`
        }
      ],
      from: { email: "hr@company.com", name: "HR Department" },
      content: [
        {
          type: "text/html",
          value: `<html><body><p>Dear ${candidate.fullName},</p><p>Your CV for <strong>${title}</strong> is shortlisted.</p><p>Please reply with your Expected Salary (Gross) and Resumption Availability.</p></body></html>`
        }
      ]
    };

    // Log the payloads to simulate sending
    console.log("Mock Sending WhatsApp:", whatsAppPayload);
    console.log("Mock Sending Email:", emailPayload);

    // Database Sync: Update the Candidate record
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { outreachSent: true }
    });

    return NextResponse.json({
      success: true,
      message: "Omnichannel outreach triggered successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Outreach Trigger Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
