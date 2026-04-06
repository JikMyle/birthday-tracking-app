import { CreateUserInput, createUserSchema } from "@/libs/validation/schemas";
import z from "@/node_modules/zod/v4/classic/external.cjs";
import { NextResponse } from "next/server";

export function validateSignUpInput(
    userData: unknown,
):
    | { valid: true; data: CreateUserInput }
    | { valid: false; response: NextResponse } {
    const result = createUserSchema.safeParse(userData);

    if (!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid user data",
                    errors: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 },
            ),
        };
    }

    return { valid: true, data: result.data };
}
