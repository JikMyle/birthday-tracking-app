import { emailSchema } from "@/libs/validation/userSchemas";
import z from "zod";

export const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password must not be empty"),
});

export type SignInInput = z.infer<typeof signInSchema>;
