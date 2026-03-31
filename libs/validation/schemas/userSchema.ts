import { EmailPreference, Role } from "@/generated/prisma/enums";

import z from "zod";

export const idSchema = z.coerce
    .number({ error: "ID must be a number" })
    .int({ error: "ID must be an integer" })
    .positive({ error: "ID must be greater than zero" });

export const usernameSchema = z
    .string({ error: "Username must be a string" })
    .min(2, { message: "Username must be at least 2 characters" })
    .max(25, { message: "Username must be at most 25 characters" });

export const emailSchema = z.email({ message: "Invalid email address" });

export const birthdateSchema = z.preprocess(
    (value) => {
        if (value === null) return undefined;
        return value;
    },
    z.coerce
        .date({ error: "Invalid date" })
        .max(new Date(), { message: "Birthdate cannot be in the future" })
        .min(new Date("1900-01-01"), {
            message: "Birthdate must be on or after 1900-01-01",
        }),
);

export const passwordSchema = z
    .string({ error: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" });

export const roleSchema = z.enum(Role, { error: "Role must be a valid value" });

export const emailPreferenceSchema = z.enum(EmailPreference, {
    error: "Email preference must be a valid value",
});

export const newUserSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    birthdate: birthdateSchema,
    password: passwordSchema,
    role: roleSchema,
    emailPreference: emailPreferenceSchema,
});

export type NewUser = z.infer<typeof newUserSchema>;

export const partialUserSchema = z
    .object({
        username: usernameSchema.optional(),
        email: emailSchema.optional(),
        birthdate: birthdateSchema.optional(),
        password: passwordSchema.optional(),
        role: roleSchema.optional(),
        emailPreference: emailPreferenceSchema.optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        { message: "No fields provided", path: ["user"] },
    );

export type PartialUser = z.infer<typeof partialUserSchema>;

// Other User properties are not necessary here
