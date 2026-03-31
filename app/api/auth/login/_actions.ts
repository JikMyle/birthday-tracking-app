import {
    emailSchema,
    passwordSchema,
} from "@/libs/validation/schemas/userSchema";
import { NextResponse } from "next/server";
import z from "zod";

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export function validateLoginCredentials(
    email: unknown,
    password: unknown,
):
    | { valid: true; data: { email: string; password: string } }
    | { valid: false; response: NextResponse } {
    const result = loginSchema.safeParse({ email: email, password: password });

    if (!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid email or password",
                    // errors: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 },
            ),
        };
    }

    return {
        valid: true,
        data: { email: result.data.email, password: result.data.password },
    };
}
