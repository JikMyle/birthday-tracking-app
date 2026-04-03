import { FormState } from "@/libs/types";
import { loginCredentialsSchema } from "../../libs/validation/schemas/authSchemas";
import { api } from "@/libs/api";

export async function login(
    state: FormState,
    formData: FormData,
): Promise<FormState> {
    const credentials = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const validated = await loginCredentialsSchema.safeParseAsync(credentials);

    if (!validated.success) {
        return {
            errors: {
                form: "Invalid email or password",
            },
            success: null,
        };
    }

    try {
        const response = await fetch(api("/api/auth/login"), {
            method: "POST",
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            return {
                errors: {
                    form: json.message ?? "Failed to login",
                },
                success: null,
            };
        }

        return {
            errors: null,
            success: json.message,
        };
    } catch (err) {
        return {
            errors: {
                form: "An error occured. Please try again later",
            },
            success: null,
        };
    }
}
