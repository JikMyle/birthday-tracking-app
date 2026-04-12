import logger from "@/libs/logger";
import {
    CreateUserInput,
    createUserSchema,
    idSchema,
    UpdateUserInfoInput,
    updateUserInfoSchema,
} from "@/libs/validation";
import z from "@/node_modules/zod/v4/classic/external.cjs";
import { NextResponse } from "next/server";

export function validateSignUpInput(
    userData: unknown,
):
    | { valid: true; data: CreateUserInput }
    | { valid: false; response: NextResponse } {
    const child = logger.child({ function: validateSignUpInput.name });
    child.trace({ userDataPresent: !!userData }, "Validating sign up input");

    const result = createUserSchema.safeParse(userData);

    if (!result.success) {
        const errors = z.flattenError(result.error);
        child.trace({ errors }, "Invalid sign up input received");

        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid user data",
                    errors: errors.fieldErrors,
                },
                { status: 400 },
            ),
        };
    }

    child.trace(
        {
            usernamePresent: !!result.data.username,
            emailPresent: !!result.data.email,
            birthdatePresent: !!result.data.birthdate,
            emailPreferencePresent: !!result.data.emailPreference,
        },
        "Successfully validated sign up input",
    );
    return { valid: true, data: result.data };
}

export function validateId(
    id: unknown,
): { valid: false; response: NextResponse } | { valid: true; data: number } {
    const child = logger.child({ function: validateId.name });
    child.trace({ idPresent: !!id }, "Validating ID");

    const result = idSchema.safeParse(id);

    if (!result.success) {
        const errors = z.flattenError(result.error);
        child.trace({ errors }, "Invalid ID received");

        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid user ID",
                    errors: { id: errors.formErrors },
                },
                { status: 400 },
            ),
        };
    }

    child.trace({ id: result.data }, "Successfully validated ID");
    return { valid: true, data: result.data };
}

export function validateIdList(
    list: unknown,
): { valid: true; data: number[] } | { valid: false; response: NextResponse } {
    const child = logger.child({ function: validateIdList.name });
    child.trace({ idListPresent: !!list }, "Validating IDs");

    const result = z
        .array(idSchema)
        .min(1, "List must not be empty")
        .safeParse(list);

    if (!result.success) {
        const flattened = z.flattenError(result.error);
        let errors = {};

        if (flattened.formErrors.length > 0)
            errors = { ids: flattened.formErrors };
        else errors = flattened.fieldErrors;

        child.trace({ errors }, "Invalid IDs received");

        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid ID list",
                    errors: errors,
                },
                { status: 400 },
            ),
        };
    }

    child.trace({ count: result.data.length }, "Successfully validated IDs");
    return { valid: true, data: result.data };
}

export function validateUpdateUserInfoInput(
    userData: unknown,
):
    | { valid: true; data: UpdateUserInfoInput }
    | { valid: false; response: NextResponse } {
    const child = logger.child({ function: validateUpdateUserInfoInput.name });
    child.trace(
        { userDataPresent: !!userData },
        "Validating update user info input",
    );

    const result = updateUserInfoSchema.safeParse(userData);

    if (!result.success) {
        const errors = z.flattenError(result.error);
        child.trace({ errors }, "Invalid update user info input received");

        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid user data",
                    errors: errors.fieldErrors,
                },
                { status: 400 },
            ),
        };
    }

    child.trace(
        {
            usernamePresent: !!result.data.username,
            birthdatePresent: !!result.data.birthdate,
            emailPreferencePresent: !!result.data.emailPreference,
        },
        "Successfully validated update user info input",
    );
    return { valid: true, data: result.data };
}
