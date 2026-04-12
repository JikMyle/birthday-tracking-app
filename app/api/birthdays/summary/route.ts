import errorHandler from "@/libs/errorHandler";
import { birthdaySearchSchema } from "@/libs/validation/dateSchema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getBirthdaySummary } from "@/libs/dal/birthdays";
import logger from "@/libs/logger";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const child = logger.child(
        {
            requestId: req.headers.get("x-request-id"),
            method: req.method,
            path: req.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    const searchParams = req.nextUrl.searchParams;
    child.trace("Received birthday summary fetch request");

    const params: Record<string, any> = {};
    if (searchParams.get("month"))
        params["month"] = Number(searchParams.get("month"));
    if (searchParams.get("day"))
        params["dayOfMonth"] = Number(searchParams.get("day"));

    child.trace(
        {
            monthPresent: !!params["month"],
            dayOfMonthPresent: !!params["dayOfMonth"],
        },
        "Validating birthday search parameters",
    );
    const validated = birthdaySearchSchema.safeParse(params);

    if (!validated.success) {
        const errors = z.flattenError(validated.error);
        child.trace(errors, "Invalid birthday search parameters received");

        return NextResponse.json(
            {
                message: "Invalid search parameters",
                errors: errors.fieldErrors,
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
