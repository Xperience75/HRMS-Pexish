import { prisma } from "@/lib/prisma";
import AttendanceHub from "./AttendanceHub";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const currentTenantId = "mock-tenant-id";

  const employees = await prisma.employee.findMany({
    where: { tenantId: currentTenantId },
    include: { user: { include: { role: true, branch: true } } },
    orderBy: { firstName: 'asc' }
  });

  const branches = await prisma.branch.findMany({
    where: { tenantId: currentTenantId },
    orderBy: { name: 'asc' }
  });

  return (
     <div className="w-full flex flex-col gap-6">
       <AttendanceHub initialEmployees={employees} branches={branches} />
     </div>
  )
}
