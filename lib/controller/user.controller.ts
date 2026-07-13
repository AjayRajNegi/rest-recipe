import { sendError } from "next/dist/server/api-utils";
import { userService } from "./service/user.service";

export const userController = {
  async getUser() {
    // Parses the schema
    // Checks validation

    try {
      const res = await userService.getUser();

      return res;
    } catch (err) {
      sendError("User fetching failed.", 404);
    }
  },

  async getAllUsers() {
    try {
      const res = await userService.getAllUser();

      return res;
    } catch (err) {}
  },
  async getUserById() {},
  async createUser() {},
};
