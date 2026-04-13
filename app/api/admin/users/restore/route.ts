import { validateIdList } from "@/app/api/_actions";
import { NextRequest, NextResponse } from "next/server";
import { restoreUsers } from "@/libs/dal/users";
import errorHandler from "@/libs/errorHandler";
import logger from "@/libs/logger";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const child = logger.child(
        {
            requestId: request.headers.get("x-request-id"),
            method: request.method,
            path: request.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    child.trace("Received restore users request");

    const body = await request.json();
    const validatedIds = validateIdList(body.ids);

    if (!validatedIds.valid) {
        return validatedIds.response;
    }

    try {
        const result = await restoreUsers(validatedIds.data);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}
