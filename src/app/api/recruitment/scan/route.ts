import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Omnichannel Triggers Mock Implementation
async function dispatchPreInterview(name: string, email: string, phone: string | undefined) {
  // Payload for SMTP (SendGrid)
  const sendGridPayload = {
    provider: "SendGrid",
    to: email,
    subject: "Interview Invitation - Executive Layer",
    body: `Dear ${name}, please securely log into the portal to complete your pre-interview assessment.`
  };

  // Payload for Twilio/WhatsApp Business API
  const twilioPayload = {
    provider: "Twilio/WhatsApp",
    to: phone || "+1-000-000-0000",
    body: `Dear ${name}, please confirm your expected gross salary by replying to this secure WhatsApp thread.`
  };

  console.log("[Omnichannel Engine] Dispatching SMTP Request:", sendGridPayload);
  console.log("[Omnichannel Engine] Dispatching WhatsApp Request:", twilioPayload);
  
  return { 
    emailStatus: "SMTP_QUEUED", 
    whatsappStatus: "TWILIO_QUEUED"
  };
}

export async function POST(request: Request) {
  try {
    const { tenantId, nin, email, firstName, lastName, phone } = await request.json();

    if (!tenantId || (!nin && !email)) {
      return NextResponse.json({ error: "Missing required identification." }, { status: 400 });
    }

    // "The Blacklist Vault" - ATS scanning against terminated/absconder records
    const absconder = await prisma.terminatedAbsconder.findFirst({
      where: {
        tenantId,
        OR: [
          ...(nin ? [{ nin }] : []),
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (absconder) {
      console.warn(`[ATS Engine] WARNING: Do-Not-Hire flag triggered for ${email || nin}`);
      return NextResponse.json({ 
        success: false, 
        flags: ["ABSCONDER_MATCH_FOUND"],
        message: "DO-NOT-HIRE MATCH: Candidate profile is flagged in the TerminatedAbsconders vault." 
      }, { status: 403 });
    }

    // Simulate heavy AI parsing & document scoring
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Trigger OmniChannel Dispatch for Pre-Interview communication
    const dispatchStatus = await dispatchPreInterview(`${firstName} ${lastName}`, email, phone);

    return NextResponse.json({ 
      success: true, 
      score: 94, 
      dispatchStatus,
      message: "Candidate passed primary firewall. Omnichannel AI hooks dispatched successfully." 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
