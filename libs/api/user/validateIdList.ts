import { idSchema } from "@/libs/validation/userSchema";
import { NextResponse } from "next/server";
import z from "zod";

const idListSchema = z
    .array(idSchema)
    .nonempty({ error: "List of IDs must not be empty" });

export function validateIdList(idList: unknown):
    | { valid: true; data: number[] }
    | { valid: false; response: NextResponse }
{
    const result = idListSchema.safeParse(idList);
    
    if(!result.success) {
        const flattened = z.flattenError(result.error)
        const errors: Record<string, unknown> = {}

        if (flattened.formErrors.length > 0) {
            errors.formErrors = flattened.formErrors
        }

        if (Object.keys(flattened.fieldErrors).length > 0) {
            errors.fieldErrors = flattened.fieldErrors
        }

        return {
            valid: false,
            response: NextResponse.json(
                { 
                    message: "Invalid ID list",
                    errors: errors
                },
                { status: 400 }
            )
        }
    }

    return {
        valid: true,
        data: result.data
    }
}