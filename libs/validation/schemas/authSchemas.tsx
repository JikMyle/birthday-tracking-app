import {
    birthdateSchema,
    emailPreferenceSchema,
    emailSchema,
    passwordSchema,
    usernameSchema,
} from "@/libs/validation/schemas/userSchemas";
import z from "@/node_modules/zod/v4/classic/external.cjs";

export const loginCredentialsSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const signUpSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        birthdate: birthdateSchema,
        password: passwordSchema,
        confirmPassword: z
            .string("Confirm password must be a string")
            .nonempty("Confirm password must not be empty"),
        emailPreference: emailPreferenceSchema,
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignUpPayload = z.infer<typeof signUpSchema>;
