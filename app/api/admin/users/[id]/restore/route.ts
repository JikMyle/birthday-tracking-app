import errorHandler from "@/libs/errorHandler";
import { validateId } from "@/app/api/_actions";
import { NextRequest, NextResponse } from "next/server";
import { restoreUserById } from "@/libs/dal/users";
import logger from "@/libs/logger";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const child = logger.child(
        {
            requestId: req.headers.get("x-request-id"),
            method: req.method,
            path: req.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    child.trace("Received restore user request");

    const { id } = await params;
    const validated = validateId(id);

    if (!validated.valid) return validated.response;

    try {
        const result = await restoreUserById(validated.data);

        if (result.count === 0) {
            return NextResponse.json(
                { message: "No user record found" },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return await errorHandler(error);
    }
}
