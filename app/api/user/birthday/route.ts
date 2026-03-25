import { Prisma } from "@/generated/prisma/client";
import errorHandler from "@/libs/api/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { birthdaySearchSchema, dayOfMonthSchema } from "@/libs/validation/dateSchema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
    request: NextRequest,
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
        const query: any[] = await prisma.$queryRaw`
            SELECT id, birthdate
            FROM User
            WHERE 
                ${month ? Prisma.sql`MONTH(birthdate) = ${month}` : Prisma.sql`1=1`}
                AND 
                ${dayOfMonth ? Prisma.sql`DAY(birthdate) = ${dayOfMonth}` : Prisma.sql`1=1`}
        `
        return NextResponse.json(
            query,
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error);
    }
}