import { EmailPreference } from "@/generated/prisma/enums";
import { api } from "@/libs/api";
import { FormActionState } from "@/libs/types";
import {
    CreateUserInput,
    createUserSchema,
} from "@/libs/validation/userSchemas";
import z from "zod";

export async function signUpUser(state: FormActionState, formData: FormData) {
    const payload = Object.fromEntries(formData);
    payload.emailPreference = getEmailPreference(
        payload.emailPreference as string | null,
    ) as FormDataEntryValue;

    const validated = createUserSchema.safeParse(payload);
    if (!validated.success) {
        const errors = z.flattenError(validated.error).fieldErrors;

        return {
            ...state,
            errors: Object.fromEntries(
                Object.entries(errors).map((value) => [value[0], value[1][0]]),
            ),
            success: null,
        };
    }

    const response = await fetch(api("/api/auth/signup"), {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(validated.data as CreateUserInput),
    });

    const body = await response.json();

    if (!response.ok) {
        return {
            ...state,
            errors: body?.errors ??
                body?.message ?? {
                    form: "A network error occured. Please try again later.",
                },
            success: null,
        };
    }

    return {
        ...state,
        errors: null,
        success: "Registration successful, now redirecting to login.",
    };
}

function getEmailPreference(value: string | null) {
    const lowered = value?.toLowerCase();
    if (lowered === "none") return EmailPreference.NONE;
    if (lowered === "serveronly") return EmailPreference.SERVER_ONLY;
    if (lowered === "everyone") return EmailPreference.EVERYONE;

    return null;
}
