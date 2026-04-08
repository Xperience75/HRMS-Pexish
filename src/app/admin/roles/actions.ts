"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRole(formData: {
  name: string;
  description: string;
  permissions: string[];
  tenantId: string;
}) {
  const { name, description, permissions, tenantId } = formData;

  try {
    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
        tenantId, // Assuming passed from the UI/session
      },
    });

    // Dummy audit log since this isn't via API
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorUserId: "SYSTEM", // Mock
        targetEntityId: newRole.id,
        actionType: "CREATE_ROLE",
        newData: { name, permissions },
      },
    });

    revalidatePath("/admin/roles");
    return { success: true, role: newRole };
  } catch (error) {
    console.error("Failed to create role:", error);
    return { success: false, error: "Failed to create role." };
  }
}
