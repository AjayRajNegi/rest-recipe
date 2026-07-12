import { userService } from "./service/user.service";

export const userController = {
  async me() {
    // Parses the schema
    // Checks validation

    const res = await userService.me();

    return res;
  },
};
