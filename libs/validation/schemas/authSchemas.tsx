import {
    emailSchema,
    passwordSchema,
} from "@/libs/validation/schemas/userSchemas";
import z from "@/node_modules/zod/v4/classic/external.cjs";

export const loginCredentialsSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
