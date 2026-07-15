import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: object, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    init,
  );
}

export function created<T>(data: T, location?: string) {
  return NextResponse.json(
    { success: true, data },
    { status: 201, headers: location ? { Location: location } : undefined },
  );
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}
