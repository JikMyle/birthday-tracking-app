import { deleteSession, verifySession } from "@/libs/dal/session";
import logger from "@/libs/logger";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const child = logger.child(
        {
            requestId: req.headers.get("x-request-id"),
            method: req.method,
            path: req.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    child.trace("Received sign out request");

    const session = await verifySession();
    await deleteSession();

    const res = NextResponse.json(
        {
            message: "Successfully signed out",
        },
        { status: 200 },
    );

    child.info(
        { userId: session.isAuth ? session.id : undefined },
        "User successfully signed out",
    );

    return res;
}
