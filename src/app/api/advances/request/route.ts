import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { tenantId, employeeId, amount } = data;

    if (!tenantId || !employeeId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // THE TIER-2 FIREWALL
    
    // 1. Reject if employee.guarantorVerified === false
    if (employee.guarantorVerified === false) {
      return NextResponse.json({ error: "Rejected: Guarantor not verified." }, { status: 403 });
    }

    // 2. Reject if the current date is > 12th of the current month
    const today = new Date();
    if (today.getDate() > 12) {
      return NextResponse.json({ error: "Rejected: Advance requests are closed after the 12th of the month." }, { status: 403 });
    }

    // 3. Reject if requested amount is > (employee.grossSalary * 0.30)
    const parsedAmount = parseFloat(amount);
    const maxAllowed = (employee.grossSalary || 0) * 0.30;
    if (parsedAmount > maxAllowed) {
      return NextResponse.json({ error: `Rejected: Requested amount exceeds the maximum allowance of ${maxAllowed}.` }, { status: 403 });
    }

    // Create the Advance Request
    const advance = await prisma.advanceRequest.create({
      data: {
        tenantId,
        employeeId,
        amount: parsedAmount,
        status: "PENDING",
      }
    });

    return NextResponse.json({ success: true, advance });

  } catch (error: any) {
    console.error("[Advances API Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
