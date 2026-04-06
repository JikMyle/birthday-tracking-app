import {
    UpdateUserInfoInput,
    updateUserInfoSchema,
} from "@/libs/validation/schemas/userSchemas";
import { NextResponse } from "next/server";
import z from "zod";

export default function validateUserInfo(
    userData: unknown,
):
    | { valid: true; data: UpdateUserInfoInput }
    | { valid: false; response: NextResponse } {
    const result = updateUserInfoSchema.safeParse(userData);

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
