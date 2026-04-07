import { NextRequest, NextResponse } from "next/server";
import { updateSession, verifySession } from "./libs/dal/session";
import { Role } from "./generated/prisma/enums";

const noAuthRoutes = ["/signin", "/signup"];
const authRoutes = ["/home"];

const stringStartWithAny = function (str: string, subs: string[]) {
    return subs.some((route) => str.startsWith(route));
};

export async function proxy(req: NextRequest) {
    const session = await verifySession();
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api")) {
        if (!session.isAuth) {
            return NextResponse.json(
                { message: "Must be logged in to access" },
                { status: 401 },
            );
        }

        await updateSession();

        if (pathName.startsWith("/api/admin")) {
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

    if (stringStartWithAny(pathName, noAuthRoutes) && session.isAuth) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (stringStartWithAny(pathName, authRoutes) && !session.isAuth) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
}

export const config = {
    matcher: ["/api/((?!auth/).*)", "/signin", "/signup", "/home"],
};
