import {
    CreateUserInput,
    createUserSchema,
    idSchema,
} from "@/libs/validation/schemas";
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

export function validateId(
    id: unknown,
): { valid: false; response: NextResponse } | { valid: true; data: number } {
    const result = idSchema.safeParse(id);

    if (!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid user ID",
                    errors: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 },
            ),
        };
    }

    return { valid: true, data: result.data };
}

export function validateIdList(
    list: unknown,
): { valid: true; data: number[] } | { valid: false; response: NextResponse } {
    const result = z
        .array(idSchema)
        .min(1, "List of IDs must not be empty")
        .safeParse(list);

    if (!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid ID list",
                    errors: z.flattenError(result.error),
                },
                { status: 400 },
            ),
        };
    }

    return {
        valid: true,
        data: result.data,
    };
}
