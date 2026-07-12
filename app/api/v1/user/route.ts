import { RouteHandler, withErrorHandler } from "@/lib/api/middleware";
import { sendSuccess } from "@/lib/api/response";
import { userController } from "@/lib/controller/user.controller";
import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const res = await userController.me();

//     // Better response handler
//     return Response.json({ message: res, status: 200 });
//   } catch (error) {}
// }

const getHandler: RouteHandler = async (req, ctx) => {
  const res = await userController.me();
  // return NextResponse.json({ mesage: "Hello" }, { status: 200 });

  return sendSuccess("User Fetched successfully", 200, res);
};

export const GET = withErrorHandler(getHandler);
