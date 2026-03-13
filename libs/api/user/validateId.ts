import { idSchema } from "@/libs/validation/userSchema";
import { NextResponse } from "next/server";
import z from "zod";

export default function validateId(id: unknown): 
    |   { valid: false; response: NextResponse }
    |   { valid: true; value: number }
{
    const result = idSchema.safeParse(id);

    if(!result.success) {
        return {
            valid: false,
            response: NextResponse.json(
                { 
                    message: "Invalid user ID",
                    errors: z.flattenError(result.error).fieldErrors
                },
                { status: 400 }
            )
        }
    }

    return { valid: true, value: result.data}
}