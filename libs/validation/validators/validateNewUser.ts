import { User } from "@/generated/prisma/client";
import { newUserSchema } from "@/libs/validation/schemas/userSchema";
import { NextResponse } from "next/server";
import z from "zod";

type omittedFields = 
    | "id" | "deletedAt" | "createdAt" | "updatedAt" 
    | "emailVerified" | "verificationToken" | "tokenExpiresAt";

export default function validateNewUser(userData: unknown):
    | { valid: true; data: Omit<User, omittedFields> }
    | { valid: false; response: NextResponse} 
{
    const result = newUserSchema.safeParse(userData);

    if(!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                { 
                    message: "Invalid user data",
                    errors: z.flattenError(result.error).fieldErrors,
                },
                { status: 400 }
            )
        }
    }

    return { valid: true, data: result.data }
}