import { Prisma } from "@/generated/prisma/client";
import prisma from "../db/prisma";
import { MONTHS } from "../months";
import {
    BirthdaySummary,
    MonthlyBirthdaySummary,
    UserBirthday,
} from "../types";
import logger from "../logger";

export async function getBirthdays(
    month?: number,
    dayOfMonth?: number,
): Promise<UserBirthday[]> {
    const child = logger.child({ function: getBirthdays.name });
    child.trace(
        { month: month, dayOfMonth: dayOfMonth },
        "Fetching user birthdays",
    );

    try {
        const birthdays: UserBirthday[] = await prisma.$queryRaw`
                SELECT id, birthdate
                FROM User
                WHERE 
                    ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                    AND 
                    ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
            `;

        child.trace(
            { month: month, dayOfMonth: dayOfMonth, count: birthdays.length },
            "Successfully fetched user birthdays",
        );

        return birthdays;
    } catch (error) {
        child.error({ error: error }, "Failed to fetch user birthdays");
        throw error;
    }
}

export async function getBirthdaySummary(
    month?: number,
    dayOfMonth?: number,
): Promise<BirthdaySummary> {
    const child = logger.child({ function: getBirthdaySummary.name });
    child.trace(
        { month: month, dayOfMonth: dayOfMonth },
        "Fetching birthday summary",
    );

    try {
        const birthdays: UserBirthday[] = await prisma.$queryRaw`
                    SELECT id, birthdate
                    FROM User
                    WHERE 
                        ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                        AND 
                        ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
                `;

        child.trace(
            { month: month, dayOfMonth: dayOfMonth, count: birthdays.length },
            "Successfully fetched user birthdays",
        );

        child.trace(
            { count: birthdays.length },
            "Grouping fetched user birthdays",
        );
        const grouped = birthdays.reduce(
            (acc, { birthdate }) => {
                const month = birthdate.getUTCMonth() + 1;
                const day = birthdate.getUTCDate();

                acc[month] ??= {
                    name: MONTHS[month - 1],
                    total: 0,
                    days: {},
                };

                acc[month].total += 1;
                acc[month].days[day] = (acc[month].days[day] ?? 0) + 1;

                return acc;
            },

            {} as Record<number, MonthlyBirthdaySummary>,
        );

        child.trace(
            { monthCount: Object.keys(grouped).length },
            "Successfully grouped user birthdays",
        );

        return { total: birthdays.length, birthdates: grouped };
    } catch (error) {
        child.error({ error: error }, "Failed to fetch birthday summary");
        throw error;
    }
}
