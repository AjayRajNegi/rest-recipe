import { NextResponse } from "next/server";

export async function GET() {
  const isDev = process.env.NODE_ENV === "development";
  return NextResponse.json(
    { message: "Health end point", isDev: isDev },
    { status: 200 },
  );
}
