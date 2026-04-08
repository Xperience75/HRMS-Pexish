import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  try {
    // 1. Setup Base Tenant ensuring it exactly exists
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'rosettee-construction-ltd' },
      update: {},
      create: {
        id: "mock-tenant-id",
        name: "Rosettee Construction Ltd.",
        slug: "rosettee-construction-ltd",
        updatedAt: new Date(),
      },
    });

    const branches = [
      "Headquarters (GRA, Ikeja, Lagos)", 
      "Shagamu Facility", 
      "Agbara", 
      "Alaro City", 
      "Ikorodu Site"
    ];

    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      await prisma.branch.upsert({
        where: { name_tenantId: { name: branch, tenantId: tenant.id } },
        update: {},
        create: { 
          id: `branch-seed-${i}`,
          name: branch, 
          location: branch, 
          tenantId: tenant.id,
          updatedAt: new Date()
        },
      });
    }

    const roles = [
      "Civil Engineer", "QA/QC Engineer", "Structural Engineer", "HSE Supervisor", 
      "HSE Officer", "HSE Marshall", "Site Nurse", "Office Administrator", 
      "IT Support", "Social Media & Digital Marketing", "Asset Management & Procurement", 
      "Site Admin", "Finance Manager", "Account Officer", "Junior Accountant", 
      "Senior Accountant", "Human Resources Manager", "Human Resources Admin", 
      "Hiab Operator", "Wheel Loader", "Truck Driver", "Batching Plant Operator", 
      "Concrete Mixer", "Excavator Operator", "Backhoe Operator"
    ];

    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      await prisma.role.upsert({
        where: { name_tenantId: { name: role, tenantId: tenant.id } },
        update: {},
        create: { 
          id: `role-seed-${i}`,
          name: role, 
          tenantId: tenant.id,
          updatedAt: new Date()
        },
      });
    }

    // === SPRINT 7 ATS VALIDATION SEEDING ===

    // 2. Seed Job Requisitions
    const requisitions = [
      { title: "Senior Financial Accountant", status: "ACTIVE" as const },
      { title: "Civil Engineer", status: "ACTIVE" as const },
      { title: "Site Administrator", status: "ACTIVE" as const },
    ];

    for (const req of requisitions) {
      const exists = await prisma.jobRequisition.findFirst({
        where: { title: req.title, tenantId: tenant.id }
      });
      
      if (!exists) {
        await prisma.jobRequisition.create({
          data: {
            title: req.title,
            status: req.status,
            tenantId: tenant.id
          }
        });
        console.log(`Created Job Requisition: ${req.title}`);
      }
    }

    // 3. Seed BlacklistVault Mock Record
    const mockBlacklist = {
        email: "ismail.absconder@fake.com",
        nin: "99999999999", 
        reason: "Job Abandonment / Absconded from Site."
    };
    
    const blacklistExists = await prisma.blacklistVault.findFirst({
        where: { email: mockBlacklist.email, tenantId: tenant.id }
    });
    
    if (!blacklistExists) {
        await prisma.blacklistVault.create({
            data: {
                email: mockBlacklist.email,
                nin: mockBlacklist.nin,
                reason: mockBlacklist.reason,
                tenantId: tenant.id
            }
        });
        console.log(`Created Blacklist Vault record for: ${mockBlacklist.email}`);
    }

    console.log("Seeding completed successfully.");
    
  } catch (error) {
    console.error("FATAL SEED ERROR: ", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
