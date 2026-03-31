import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../db/prisma";
import { MONTHS } from "../months";

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

export async function getBirthdays(
    month?: number,
    dayOfMonth?: number,
): Promise<UserBirthday> {
    return prisma.$queryRaw`
            SELECT id, birthdate
            FROM User
            WHERE 
                ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                AND 
                ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
        `;
}

export async function getBirthdaySummary(
    month?: number,
    dayOfMonth?: number,
): Promise<BirthdaySummary> {
    const birthdays: UserBirthday[] = await prisma.$queryRaw`
                SELECT id, birthdate
                FROM User
                WHERE 
                    ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                    AND 
                    ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
            `;

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

    return { total: birthdays.length, birthdates: grouped };
}
