import { createUser } from "@/libs/dal/users";
import { validateSignUpInput } from "../../_actions";
import { NextRequest, NextResponse } from "next/server";
import errorHandler from "@/libs/errorHandler";
import logger from "@/libs/logger";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const child = logger.child(
        {
            requestId: req.headers.get("x-request-id"),
            method: req.method,
            path: req.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    const body = await req.json();
    child.trace("Received sign up request");

    const validated = validateSignUpInput(body);

    if (!validated.valid) {
        return validated.response;
    }

    try {
        const user = await createUser(validated.data);
        const res = NextResponse.json(user, { status: 201 });

        return res;
    } catch (error) {
        return await errorHandler(error);
    }
}
