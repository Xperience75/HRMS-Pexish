import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

// Placeholder ID Card Trigger
async function generateVirtualID(employeeId: string, name: string, bloodGroup: string | null) {
  // Overlays candidate's data onto an SVG/Canvas layout
  console.log(`[Virtual ID Engine] Generating ID for ${name} (${employeeId}) - Blood Group: ${bloodGroup || 'N/A'}`);
  return `https://s3.enterprise.com/id-cards/${employeeId}.svg`;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { tenantId, firstName, lastName, email, nin, bloodGroup, guarantorVerified, designation, assignedBranch, employmentType, grossSalary, bankAccount } = data;
    
    // Instantiate Employee with nested User relational bindings
    const employee = await prisma.employee.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        firstName,
        lastName,
        email,
        nin,
        bloodGroup,
        guarantorVerified,
        grossSalary,
        bankAccount,
        Tenant: { connect: { id: tenantId } },
        User: {
          create: {
            id: crypto.randomUUID(),
            updatedAt: new Date(),
            firstName,
            lastName,
            email,
            passwordHash: "pending-setup",
            Tenant: { connect: { id: tenantId } },
            Role: { connect: { id: designation } },
            Branch: { connect: { id: assignedBranch } }
          }
        }
      }
    });

    // ID Card Trigger
    const virtualIdUrl = await generateVirtualID(employee.id, `${firstName} ${lastName}`, bloodGroup);

    return NextResponse.json({ success: true, employee, virtualIdUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
