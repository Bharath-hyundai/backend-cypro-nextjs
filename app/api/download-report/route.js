import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "lead-report.xlsx");

export async function GET() {
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { message: "No leads recorded yet" },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=lead-report.xlsx",
    },
  });
}