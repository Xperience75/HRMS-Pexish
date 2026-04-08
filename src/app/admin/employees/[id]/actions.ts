"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTaxRelief(id: string, pension: boolean, rent: boolean) {
  await prisma.employee.update({
    where: { id },
    data: { applyPensionRelief: pension, applyRentRelief: rent }
  });
  revalidatePath(`/admin/employees/${id}`);
  revalidatePath('/admin/payroll');
}
