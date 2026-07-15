import z from "zod";

export async function parseBody() {}

export async function parseQuery<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): z.infer<T> {
  const { searchParams } = new URL(request.url);
  const result = schema.safeParse(Object.fromEntries(searchParams));

  if (!result.success) {
    // throw new Error(
    //   400,
    //   "INVALID_QUERY",
    //   "Invalid query parameters",
    //   result.error.flatten().fieldErrors,
    // );

    throw new Error("invalid query");
  }
  return result.data;
}
