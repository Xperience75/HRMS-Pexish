import { prisma } from '@/lib/prisma';

export async function calculatePayroll(tenantId: string, monthDate: Date) {
  const employees = await prisma.employee.findMany({
    where: { tenantId },
    include: {
      User: { include: { Branch: true } },
      AttendanceRecord: {
        where: {
          date: {
            gte: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
            lte: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59),
          }
        }
      },
      AdvanceRequest: {
        where: {
          status: "APPROVED"
        }
      }
    }
  });

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let weekends = 0;
  let sundays = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i).getDay();
    if (d === 0) sundays++; // Sunday
    if (d === 6 || d === 0) weekends++; // Saturday or Sunday
  }

  const results = employees.map(emp => {
    // 1. DYNAMIC DIVISOR (Working Days)
    const branchName = emp.User?.Branch?.name?.toUpperCase() || "";
    let workingDays = daysInMonth;
    if (branchName.includes("HEADQUARTERS") || branchName === "HQ") {
      workingDays = daysInMonth - weekends;
    } else {
      workingDays = daysInMonth - sundays;
    }

    const grossSalary = emp.grossSalary || 0;
    const dailyRate = workingDays > 0 ? (grossSalary / workingDays) : 0;
    const unauthorizedAbsenceCount = emp.AttendanceRecord.filter(r => r.status === "ABSENT_UNAUTHORIZED").length;
    let earnedGross = Math.max(0, grossSalary - (unauthorizedAbsenceCount * dailyRate));

    // 2. THE TIER-2 SALARY SPLIT (BHT = 65%)
    const basic = earnedGross * 0.35;
    const housing = earnedGross * 0.15;
    const transport = earnedGross * 0.15;
    const utility = earnedGross * 0.15;
    const medical = earnedGross * 0.20;
    const bhtTotal = basic + housing + transport;

    // 3. STATUTORY RELIEFS (Annualized for calculation)
    const annualGross = earnedGross * 12;
    let annualPension = 0;
    let annualRentRelief = 0;

    const pensionEnabled = emp.applyPensionRelief ?? true; 
    const rentReliefEnabled = emp.applyRentRelief ?? true;

    if (pensionEnabled) {
       annualPension = (bhtTotal * 12) * 0.08; 
    }
    if (rentReliefEnabled) {
       annualRentRelief = Math.min((annualGross * 0.20), 500000); 
    }

    const chargeableAnnualIncome = Math.max(0, annualGross - annualPension - annualRentRelief);

    // 4. THE 2026 NIGERIA TAX ACT (Graduated Scale)
    let annualTax = 0;
    let remainingIncome = chargeableAnnualIncome;

    if (remainingIncome > 0) {
        // Band 1: First 800,000 @ 0%
        const band1 = Math.min(800000, remainingIncome);
        annualTax += band1 * 0.00;
        remainingIncome -= band1;
    }
    if (remainingIncome > 0) {
        // Band 2: Next 2,200,000 @ 15%
        const band2 = Math.min(2200000, remainingIncome);
        annualTax += band2 * 0.15;
        remainingIncome -= band2;
    }
    if (remainingIncome > 0) {
        // Band 3: Next 2,400,000 @ 18%
        const band3 = Math.min(2400000, remainingIncome);
        annualTax += band3 * 0.18;
        remainingIncome -= band3;
    }
    if (remainingIncome > 0) {
        // Band 4: Above 5,400,000 @ 24%
        annualTax += remainingIncome * 0.24;
    }

    const monthlyPayeTax = annualTax / 12;
    const advancesRepaid = emp.AdvanceRequest.reduce((sum, adv) => sum + adv.amount, 0);
    const finalNetPay = earnedGross - (pensionEnabled ? (bhtTotal * 0.08) : 0) - monthlyPayeTax - advancesRepaid;

    return {
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      metrics: {
        branchName: branchName,
        workingDays: workingDays,
        unauthorizedAbsenceCount: unauthorizedAbsenceCount,
        dailyRate: dailyRate
      },
      payout: {
        grossSalary: grossSalary,
        earnedGross: earnedGross,
        absentDeductions: (unauthorizedAbsenceCount * dailyRate),
        payeTax: monthlyPayeTax,
        pension: (pensionEnabled ? (bhtTotal * 0.08) : 0),
        advancesRepaid: advancesRepaid,
        finalNetPay: finalNetPay
      },
      tier2Split: { basic, housing, transport, utility, medical }
    };
  });
  return results;
}
