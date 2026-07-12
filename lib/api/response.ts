import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  message: string,
  statusCode: number = 200,
  data?: T,
): NextResponse => {
  const response: ApiResponse<T> = { success: true, message, data };
  return NextResponse.json(response, { status: 200 });
};

export const sendError = (
  message: string,
  statusCode: number = 400,
  error?: string,
): NextResponse => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };

  return NextResponse.json(response, {
    status: statusCode,
  });
};
