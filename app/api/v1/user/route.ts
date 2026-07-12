import { userController } from "@/lib/controller/user.controller";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const res = await userController.me();

//     // Better response handler
//     return Response.json({ message: res, status: 200 });
//   } catch (error) {}
// }

const getHandler = () => {
  return async () => {
    const res = await userController.me();

    // Better response handler
    return Response.json({ message: res, status: 200 });
  };
};

export const GET = getHandler();
