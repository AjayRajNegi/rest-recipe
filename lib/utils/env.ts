export const envConfig = {
  env: process.env.NODE_ENV || "development",
  db: {
    url: process.env.DATABASE_URL,
  },
  // jwt: {
  //   accessSecret: process.env.JWT_ACCESS_SECRET!,
  //   refreshSecret: process.env.JWT_REFRESH_SECRET!,
  //   accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  //   refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  // },
  // bcrypt: {
  //   rounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  // },
  rateLimit: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
};

// const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
const required = ["DATABASE_URL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variables: ${key}`);
  }
}
