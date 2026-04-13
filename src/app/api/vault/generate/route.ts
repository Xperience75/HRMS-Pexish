import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TARGET 2: The "Smart Fetch" Tag Dictionary
const TAG_DICTIONARY = [
  "EMPLOYEE_FULL_NAME",
  "DESIGNATION",
  "BRANCH_NAME",
  "RESUMPTION_DATE",
  "GROSS_SALARY",
  "BASIC_SALARY",
  "COMPANY_NAME"
];

export async function POST(req: Request) {
  try {
    const { templateId, employeeId } = await req.json();

    if (!templateId || !employeeId) {
      return NextResponse.json(
        { error: "Template ID and Employee ID are required." },
        { status: 400 }
      );
    }

    // 1. Fetch Employee Profile (360 profile)
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        Tenant: true,
        User: {
          include: {
            Branch: true,
            Role: true
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found." },
        { status: 404 }
      );
    }

    // 2. Fetch the requested Template
    const template = await prisma.templateDocument.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found." },
        { status: 404 }
      );
    }

    // 3. Prepare data for Tag Dictionary mapping
    // Tier-2 35% split for Basic Salary
    const basicSalary = (employee.grossSalary * 0.35).toFixed(2);
    
    // Fallbacks
    const branchName = employee.User?.Branch?.name || "Corporate HQ";
    const designation = employee.title || employee.User?.Role?.name || "Staff";
    const companyName = employee.Tenant?.name || "Acme Corporation";

    const mappedData: Record<string, string> = {
      EMPLOYEE_FULL_NAME: `${employee.firstName} ${employee.lastName}`,
      DESIGNATION: designation,
      BRANCH_NAME: branchName,
      RESUMPTION_DATE: employee.createdAt.toLocaleDateString(), // Mocking resumption date as creation date for now
      GROSS_SALARY: `₦${employee.grossSalary.toLocaleString()}`,
      BASIC_SALARY: `₦${Number(basicSalary).toLocaleString()}`,
      COMPANY_NAME: companyName
    };

    // 4. Mocking the document generation (regex string replacement)
    // Placeholder logic for the actual .docx parsing library (e.g. docxtemplater)
    
    let simulatedTemplateContent = `
      COMPANY: {{COMPANY_NAME}}
      ---------------------------------
      Dear {{EMPLOYEE_FULL_NAME}},
      
      We are pleased to offer you the position of {{DESIGNATION}} at our {{BRANCH_NAME}} branch.
      Your expected resumption date is {{RESUMPTION_DATE}}.
      
      Compensation Details:
      Gross Salary: {{GROSS_SALARY}}
      Basic Salary: {{BASIC_SALARY}}
    `;
    
    // Execute regex string replacement using the Tag Dictionary
    TAG_DICTIONARY.forEach(tag => {
      const regex = new RegExp(`{{${tag}}}`, 'g');
      simulatedTemplateContent = simulatedTemplateContent.replace(regex, mappedData[tag] || '');
    });

    // Mocking a compiled document buffer
    const mockBuffer = Buffer.from(simulatedTemplateContent).toString('base64');
    
    return NextResponse.json({
      success: true,
      message: "Document generated successfully.",
      data: {
        fileName: `${employee.lastName}_${template.name}.docx`,
        fileBuffer: mockBuffer,
        downloadLink: `/api/vault/download?file=${employee.id}_${template.id}.docx` // Mocked download link
      }
    });

  } catch (error: any) {
    console.error("Vault Generation API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during document generation." },
      { status: 500 }
    );
  }
}
