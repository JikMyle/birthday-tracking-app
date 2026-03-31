import { NextRequest, NextResponse } from "next/server";
import { updateSession, verifySession } from "./libs/dal/session";
import { Role } from "./generated/prisma/enums";

export async function proxy(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/api")) {
        const session = await verifySession();

        if (!session.isAuth) {
            return NextResponse.json(
                { message: "Must be logged in to access" },
                { status: 401 },
            );
        }

        await updateSession();

        if (req.nextUrl.pathname.startsWith("/api/admin")) {
            if (session.role !== Role.ADMIN) {
                return NextResponse.json(
                    {
                        message:
                            "Access not authorized, insufficient privileges",
                    },
                    { status: 401 },
                );
            }
        }
    }
}

export const config = {
    matcher: ["/api/((?!auth/).*)"],
};
