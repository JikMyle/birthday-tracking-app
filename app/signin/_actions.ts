import { FormActionState } from "@/libs/types";
import { SignInInput, signInSchema } from "../../libs/validation/authSchemas";
import { api } from "@/libs/api";
import z from "zod";

export async function signIn(
    state: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    const credentials = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const validated = await signInSchema.safeParseAsync(credentials);

    if (!validated.success) {
        const errors = z.flattenError(validated.error).fieldErrors;

        return {
            ...state,
            errors: {
                email: errors.email?.at(0),
                password: errors.password?.at(0),
            },
            success: null,
        };
    }

    try {
        const response = await fetch(api("/api/auth/signin"), {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                email: validated.data.email,
                password: validated.data.password,
            } as SignInInput),
        });

        let json = null;
        try {
            json = await response.json();
        } catch (err) {
            json = { message: response.statusText };
        }

        if (!response.ok) {
            return {
                ...state,
                errors: {
                    form: json.message ?? "Failed to sign in",
                },
                success: null,
            };
        }

        return {
            ...state,
            errors: null,
            success: json.message,
        };
    } catch (err) {
        return {
            ...state,
            errors: {
                form: "An error occured. Please try again later",
            },
            success: null,
        };
    }
}
