import { NextRequest, NextResponse } from "next/server";
import { SessionAuth, updateSession, verifySession } from "./libs/dal/session";
import { Role } from "./generated/prisma/enums";
import logger from "./libs/logger";

/**
 * Routes not in public nor protected are always accessible by default,
 * while API routes require authentication by default.
 */
const routeConfig = {
    public: ["/signin", "/signup"],
    protected: ["/home"],
    publicApi: ["/api/auth/signin", "/api/auth/signup", "/api/auth/signout"],
} as const;

const startsWithAny = (str: string, subs: string[]) =>
    subs.some((route) => str.startsWith(route));

export async function proxy(req: NextRequest) {
    const requestId = crypto.randomUUID();
    const pathName = req.nextUrl.pathname;

    const child = logger.child(
        {
            requestId,
            method: req.method,
            path: pathName,
        },
        { msgPrefix: "[MIDDLEWARE] " },
    );

    child.trace("Middleware invoked");

    const session = await verifySession();

    if (pathName.startsWith("/api")) {
        return apiProxy(session, req, requestId);
    }

    if (startsWithAny(pathName, [...routeConfig.public]) && session.isAuth) {
        child.trace("Authenticated user redirected away from public route");

        await updateSession();
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (
        startsWithAny(pathName, [...routeConfig.protected]) &&
        !session.isAuth
    ) {
        child.warn("Unauthenticated access attempt to protected route");
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (session.isAuth) {
        await updateSession();
    }
}

async function apiProxy(
    session: SessionAuth,
    req: NextRequest,
    requestId: string,
): Promise<NextResponse | void> {
    const pathName = req.nextUrl.pathname;
    const child = logger.child(
        {
            requestId,
            method: req.method,
            path: pathName,
        },
        { msgPrefix: "[MIDDLEWARE] [API] " },
    );

    if (startsWithAny(pathName, [...routeConfig.publicApi])) {
        child.trace("Public API route, skipping auth");

        const res = NextResponse.next();
        res.headers.set("x-request-id", requestId);
        return res;
    }

    if (!session.isAuth) {
        child.warn("Unauthenticated API access attempt");

        return NextResponse.json(
            { message: "Must be logged in to access" },
            { status: 401 },
        );
    }

    // Session immediately refreshed after authentication
    await updateSession();

    if (pathName.startsWith("/api/admin")) {
        if (session.role !== Role.ADMIN) {
            child.warn(
                { userId: session.id, userRole: session.role },
                "Unauthorized admin API access attempt",
            );

            return NextResponse.json(
                {
                    message: "Access not authorized, insufficient privileges",
                },
                { status: 403 },
            );
        }

        child.info({ userId: session.id }, "Admin API access granted");
    }

    const res = NextResponse.next();
    res.headers.set("x-request-id", requestId);
    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|.*\\.ico|.*\\.png$).*)"],
};
