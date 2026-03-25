import z from "zod";

export const dayOfMonthSchema = z
    .int("Day of month must be an integer")
    .min(1, "Day of month must be greater than or equal to 1")
    .max(31, "Day of month must be less than or equal to 31")

export const monthSchema = z
    .int("Month must be an integer")
    .min(1, "Month must be greater than or equal to 1")
    .max(12, "Month must be less than or equal to 12")

export const birthdaySearchSchema = z.object({
    month: monthSchema.optional(),
    dayOfMonth: dayOfMonthSchema.optional(),
}).refine(
    (args) => args.dayOfMonth ? args.month : true,
    {
        message: "Month must not empty",
        path: ['month']
    }
)