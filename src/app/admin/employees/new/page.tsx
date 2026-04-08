import React from 'react';
import { prisma } from '@/lib/prisma';
import NewEmployeeForm from './NewEmployeeForm';

export const dynamic = "force-dynamic";

export default async function NewEmployeeGenesisPage() {
  const roles = await prisma.role.findMany({
    where: { tenantId: "mock-tenant-id" },
    orderBy: { name: 'asc' }
  });
  
  const branches = await prisma.branch.findMany({
    where: { tenantId: "mock-tenant-id" },
    orderBy: { name: 'asc' }
  });

  return <NewEmployeeForm roles={roles} branches={branches} />;
}
