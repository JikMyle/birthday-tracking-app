import { User } from "@/generated/prisma/client";
import { partialUserSchema } from "@/libs/validation/userSchema";
import { NextResponse } from "next/server";
import z from "zod";



export default function validatePartialUser(userData: unknown):
    | { valid: true; data: Partial<User> }
    | { valid: false; response: NextResponse} 
{
    const result = partialUserSchema.safeParse(userData);

    if(!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                { 
                    message: "Invalid user data",
                    errors: z.flattenError(result.error).fieldErrors
                },
                { status: 400 }
            )
        }
    }

    return { valid: true, data: result.data }
}