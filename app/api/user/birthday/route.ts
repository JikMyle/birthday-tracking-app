import errorHandler from "@/libs/api/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
): Promise<NextResponse> {
    const searchParams = request.nextUrl.searchParams

    const intOrNull = (param: unknown): number | null => {
        if (param === null || param === undefined) return null;
        const num = Number(param);
        return Number.isInteger(num) && num >= 0 ? num : null;
    }

    const isValidMonth = (value: number): boolean => {
        return (value >= 0 && value < 12)
    }

    const isValidDate = (value: number): boolean => {
        return (value > 0 && value <= 31)
    }

    const month = intOrNull(searchParams.get("month"))
    const date = intOrNull(searchParams.get("date"))

    if( !month 
        || !isValidMonth(month) 
        || (date && !isValidDate(date))) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        let birthdays = undefined

        if(month && date) {
            birthdays = await prisma.$queryRaw`
                SELECT id, birthdate
                FROM User
                WHERE MONTH(birthdate) = ${month}
                AND DAY(birthdate) = ${date}
            `
        } else if(month) {
            birthdays = await prisma.$queryRaw`
                SELECT id, birthdate
                FROM User
                WHERE MONTH(birthdate) = ${month}
            `
        }

        return NextResponse.json(
            birthdays,
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error);
    }
}