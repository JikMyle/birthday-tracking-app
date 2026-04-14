import { User } from "@/generated/prisma/client";

export type FormState = {
    submitCount: number;
    formData: Record<string, string | string[]>;
};

export interface FormActionState {
    errors: Record<string, string | undefined> | null;
    success: string | null;
}
export type UserSummary = Pick<
    User,
    "id" | "username" | "email" | "birthdate" | "emailPreference"
>;

export type PublicUser = Omit<User, "password">;

export type UserBirthday = { id: number; birthdate: Date };

export type MonthlyBirthdaySummary = {
    name: string;
    total: number;
    days: Record<number, number>;
};

export type BirthdaySummary = {
    total: number;
    birthdates: Record<number, MonthlyBirthdaySummary>;
};
