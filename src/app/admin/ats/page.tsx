import { PrismaClient } from "@prisma/client";
import ATSPipelineClient from "./client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export default async function ATSPipelinePage() {
  // Using a consistent mock tenantId for testing as per standard setup
  const tenantId = "mock-tenant-id"; 

  const candidates = await prisma.candidate.findMany({
    where: { tenantId },
    include: { JobRequisition: true },
    orderBy: { createdAt: "desc" }
  });

  const requisitions = await prisma.jobRequisition.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <ATSPipelineClient 
      initialCandidates={candidates} 
      requisitions={requisitions} 
      tenantId={tenantId} 
    />
  );
}
