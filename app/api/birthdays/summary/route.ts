import { Prisma } from "@/generated/prisma/client";
import errorHandler from "@/libs/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { MONTHS } from "@/libs/months";
import { birthdaySearchSchema } from "@/libs/validation/dateSchema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getBirthdaySummary } from "@/libs/dal/birthdays";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const searchParams = request.nextUrl.searchParams;

    const params: Record<string, any> = {};
    if (searchParams.get("month"))
        params["month"] = Number(searchParams.get("month"));
    if (searchParams.get("day"))
        params["dayOfMonth"] = Number(searchParams.get("day"));

    const validated = birthdaySearchSchema.safeParse(params);

    if (!validated.success) {
        return NextResponse.json(
            {
                message: "Invalid search parameters",
                errors: z.flattenError(validated.error).fieldErrors,
            },
            { status: 400 },
        );
    }

    try {
        const summary = await getBirthdaySummary(
            validated.data.month,
            validated.data.dayOfMonth,
        );

        return NextResponse.json(summary, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}
