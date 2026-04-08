"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function publishGlobalSettings(formData: {
  tenantId: string;
  brandHex: string;
  logoUrl?: string;
  activeWorkDays: string[];
  advanceMaxPercentage: number;
  advanceCutoffDay: number;
  enforceHardLock: boolean;
  financeEmails: string;
}) {
  const { tenantId, brandHex, activeWorkDays, advanceMaxPercentage, advanceCutoffDay, enforceHardLock, financeEmails } = formData;

  try {
    // 1. Array parsing
    const emailsArray = financeEmails.split(",").map(e => e.trim()).filter(e => e.includes("@"));
    const workweekDivisor = activeWorkDays.length;

    // 2. Update Tenant (Core logic for Workweek and Branding implicitly assumed, 
    //    though Prisma schema only has workweekDivisor on Tenant, we can push Branding to TenantSettings)
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        workweekDivisor,
      },
    });

    // 3. Update or Create Tenant Settings via Upsert to prevent crashes on first save
    const settings = await prisma.tenantSetting.upsert({
      where: { tenantId },
      update: {
        advanceMaxPercentage,
        advanceCutoffDay,
        advanceRequireGuarantor: enforceHardLock, // mapped based on requirements mapping
        workingDaysConfig: activeWorkDays,
        financeExportEmails: emailsArray,
      },
      create: {
        tenantId,
        advanceMaxPercentage,
        advanceCutoffDay,
        advanceRequireGuarantor: enforceHardLock,
        workingDaysConfig: activeWorkDays,
        financeExportEmails: emailsArray,
      },
    });

    // 4. Trigger Immutable Audit Trail Record natively within Server Action
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorUserId: "SYSTEM_ADMIN",
        targetEntityId: settings.id,
        actionType: "UPDATE_GLOBAL_RULES",
        newData: { workweekDivisor, advanceMaxPercentage, advanceCutoffDay, activeWorkDays, emailsArray, brandHex },
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update global settings:", error);
    return { success: false, error: "Settings transaction failed." };
  }
}

// AWS S3 Mock Upload Action Header
export async function uploadLogoToS3(formData: FormData) {
  // Logic to pipe binary to S3
  const file = formData.get("logo") as File;
  console.log(`Mocking upload for file: ${file?.name} to AWS S3 / blob storage`);
  return { success: true, url: "https://s3.aws.amazon.com/mock-bucket/logo.png" };
}

// Action exposed explicitly for the Payroll Module dependency
export async function fetchWorkweekDivisor(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { workweekDivisor: true }
  });
  return tenant?.workweekDivisor || 5;
}
