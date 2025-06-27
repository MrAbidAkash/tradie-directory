// app/api/validate-credentials/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { validateBusinessCredentials } from "@/lib/ai-validation";

export async function POST(req: Request) {
  try {
    const { name, abn, services, licenses, insurances, certifications, files } =
      await req.json();

    // Mock file handling for validation preview
    const mockFiles = files.map((file: string) => {
      return { path: file };
    });

    const validationResult = await validateBusinessCredentials({
      name,
      abn, // Include ABN
      services,
      licenses,
      insurances,
      certifications,
      files: mockFiles,
    });

    return NextResponse.json({
      valid: validationResult.valid,
      message: validationResult.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: error.message || "Validation failed" },
      { status: 500 },
    );
  }
}
