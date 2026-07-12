const user = {
  firstName: "Ajay",
  lastName: "Raj",
  age: 23,
  address: "balawala, dehradun",
  isVerified: false,
};

export const userService = {
  async me() {
    const res = user;

    if (!res) throw new Error("No user");
    return res;
  },
};
