import { NextRequest, NextResponse } from "next/server";
import { updateSession, verifySession } from "./libs/dal/session";
import { Role } from "./generated/prisma/enums";

const noAuthRoutes = ["/login", "/signup"];
const authRoutes = ["/home"];

const stringStartWithAny = function (str: string, subs: string[]) {
    return subs.some((route) => str.startsWith(route));
};

export async function proxy(req: NextRequest) {
    const session = await verifySession();

    if (req.nextUrl.pathname.startsWith("/api")) {
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

    if (
        stringStartWithAny(req.nextUrl.pathname, noAuthRoutes) &&
        session.isAuth
    ) {
        console.log("Redirect to home");
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (
        stringStartWithAny(req.nextUrl.pathname, authRoutes) &&
        !session.isAuth
    ) {
        console.log("Redirect to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/api/((?!auth/).*)", "/login", "/signup", "/home"],
};
