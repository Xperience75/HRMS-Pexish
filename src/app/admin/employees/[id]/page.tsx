import { prisma } from "@/lib/prisma";
import VaultClient from "./VaultClient";
import { notFound } from "next/navigation";

export default async function EmployeeVaultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          role: true,
          department: true,
          branch: true
        }
      }
    }
  });

  if (!employee) {
    return notFound();
  }

  return <VaultClient employee={employee} />;
}
