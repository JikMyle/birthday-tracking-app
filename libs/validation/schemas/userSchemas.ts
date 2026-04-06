import { EmailPreference, Role } from "@/generated/prisma/enums";

import z from "zod";

// Schema only accepts numbers or parsable strings, anything else throws an invalid type error
export const idSchema = z.preprocess(
    (value, ctx) => {
        if (typeof value === "number") return value;

        if (typeof value !== "string") {
            ctx.addIssue({
                code: "invalid_type",
                expected: "string",
                received:
                    typeof value === "object"
                        ? value === null
                            ? "null"
                            : Array.isArray(value)
                              ? "array"
                              : "object"
                        : typeof value,
                message: "ID must be a number",
            });
            return z.NEVER;
        }

        return Number(value);
    },
    z.coerce
        .number({ error: "ID must be a number" })
        .int({ error: "ID must be an integer" })
        .positive({ error: "ID must be greater than zero" }),
);

export const usernameSchema = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(25, "Username must be at most 25 characters")
    .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
    );

export const emailSchema = z.email("Invalid email address");

// Schema only accepts Date objects or String, anything else throws an invalid type error
export const birthdateSchema = z.preprocess(
    (value, ctx) => {
        if (value instanceof Date) return value;

        if (typeof value !== "string") {
            ctx.addIssue({
                code: "invalid_type",
                expected: "string",
                received:
                    typeof value === "object"
                        ? value === null
                            ? "null"
                            : Array.isArray(value)
                              ? "array"
                              : "object"
                        : typeof value,
                message:
                    'Invalid date format, expected ISO 8601 (e.g. "1990-06-15")',
            });
            return z.NEVER;
        }

        return new Date(value);
    },
    z.coerce
        .date('Invalid date format, expected ISO 8601 (e.g. "1990-06-15")')
        .max(new Date(), "Birthdate cannot be in the future")
        .min(
            new Date("1900-01-01"),
            "Birthdate must be on or after 1900-01-01",
        ),
);

// NOTE: Add more password requirements in the future, once app is more stable
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters");

export const roleSchema = z.enum(Role, "Invalid role");

export const emailPreferenceSchema = z.enum(
    EmailPreference,
    "Invalid email preference",
);

export const createUserSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    birthdate: birthdateSchema,
    password: passwordSchema,
    emailPreference: emailPreferenceSchema,
});

export const updateUserInfoSchema = z
    .object({
        username: usernameSchema.optional(),
        birthdate: birthdateSchema.optional(),
        emailPreference: emailPreferenceSchema.optional(),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        { message: "No fields provided", path: [] },
    );

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInfoInput = z.infer<typeof updateUserInfoSchema>;
