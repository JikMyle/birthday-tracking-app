import { Prisma } from "@/generated/prisma/client";
import errorHandler from "@/libs/api/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { MONTHS } from "@/libs/months";
import { birthdaySearchSchema } from "@/libs/validation/dateSchema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type UserBirthdate = {
    id: number,
    birthdate: Date
}

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    const searchParams = request.nextUrl.searchParams

    const params: Record<string, any> = {}
    if(searchParams.get('month')) params['month'] = Number(searchParams.get('month'))
    if(searchParams.get('day')) params['dayOfMonth'] = Number(searchParams.get('day'))

    const validated = birthdaySearchSchema.safeParse(params)

    if(!validated.success) {
        return NextResponse.json({
            message: "Invalid search parameters",
            errors: z.flattenError(validated.error).fieldErrors
        }, { status: 400 })
    }

    const { month, dayOfMonth } = validated.data

    try {
        const query: UserBirthdate[] = await prisma.$queryRaw`
            SELECT id, birthdate
            FROM User
            WHERE 
                ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                AND 
                ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
        `;

        const total = query.length
        const grouped = Object.entries(groupByMonth(query))
            .map((month) => {
                const index = month[0]
                const total = month[1]?.length || 0

                const groupedByDay = Object.entries(groupByDay(month[1] || []))
                    .map((day) => [ day[0], day[1]?.length || 0])

                return [
                    index, 
                    { 
                        name: MONTHS[Number(index) - 1],
                        total: total, 
                        days: Object.fromEntries(groupedByDay) 
                    }
                ]
            })

        return NextResponse.json(
            { total: total, birthdates: Object.fromEntries(grouped) },
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error);
    }
}

function groupByMonth(
    birthdates: UserBirthdate[]
): Partial<Record<number, UserBirthdate[]>>  {
    return Object.groupBy(birthdates,
        (item) => item.birthdate.getUTCMonth() + 1
    )
}

function groupByDay(
    birthdates: UserBirthdate[]
): Partial<Record<number, UserBirthdate[]>>  {
    return Object.groupBy(birthdates,
        (item) => item.birthdate.getUTCDate()
    )
}