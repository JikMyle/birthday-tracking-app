import { User } from "@/generated/prisma/client";

export interface FormState {
    formData: Record<string, string | string[]> | null;
    errors: Record<string, string> | null;
    success: string | null;
}
export type UserSummary = Pick<
    User,
    "id" | "username" | "email" | "birthdate" | "emailPreference"
>;

export type PublicUser = Omit<User, "password">;
