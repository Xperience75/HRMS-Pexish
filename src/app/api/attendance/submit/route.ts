import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { tenantId, date, records } = data; 
    // records: { employeeId: string, status: string }[]

    if (!tenantId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid payload mapping" }, { status: 400 });
    }

    const attendanceDate = new Date(date);

    // CRITICAL LOGIC: Bulk transaction to prevent connection drop / timeouts
    await prisma.$transaction(async (tx) => {
      for (const record of records) {
        const { employeeId, status } = record;

        // Upsert the attendance record securely
        // The deductionQueued flag explicitly logs the Payroll Engine identifier
        // when status === 'ABSENT_UNAUTHORIZED'
        await tx.attendanceRecord.upsert({
          where: {
            employeeId_date: {
              employeeId,
              date: attendanceDate
            }
          },
          update: {
            status,
            deductionQueued: status === 'ABSENT_UNAUTHORIZED'
          },
          create: {
            id: crypto.randomUUID(),
            tenantId,
            employeeId,
            date: attendanceDate,
            status,
            deductionQueued: status === 'ABSENT_UNAUTHORIZED'
          }
        });
      }
    }, { maxWait: 15000, timeout: 30000 });

    return NextResponse.json({ success: true, count: records.length });
  } catch (error: any) {
    console.error("[Attendance API Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
