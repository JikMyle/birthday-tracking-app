import {
    birthdateSchema,
    emailPreferenceSchema,
    emailSchema,
    passwordSchema,
    usernameSchema,
} from "@/libs/validation/schemas/userSchemas";
import z from "@/node_modules/zod/v4/classic/external.cjs";

export const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password must not be empty"),
});

export const signUpSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        birthdate: birthdateSchema,
        password: passwordSchema,
        confirmPassword: z
            .string()
            .min(1, "Confirm password must not be empty"),
        emailPreference: emailPreferenceSchema,
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
