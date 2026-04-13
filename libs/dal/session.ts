import "server-only";

import { Role } from "@/generated/prisma/enums";
import { errors, JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import logger from "../logger";

const SESSION_LIFE_SPAN_MILLIS = 60 * 60 * 3 * 1000;
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export interface SessionPayload extends JWTPayload {
    id: number;
    username: string;
    role: Role;
}

export class SessionExpiredError extends Error {
    constructor() {
        super("Session has expired");
    }
}

export class SessionInvalidError extends Error {
    constructor() {
        super("Session is invalid or malformed");
    }
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
    const child = logger.child({ function: encryptSession.name });
    child.trace({ userId: payload.id }, "Encrypting session");

    const session = new SignJWT(payload)
        .setExpirationTime(new Date(Date.now() + SESSION_LIFE_SPAN_MILLIS))
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(encodedKey);

    child.trace({ tokenPresent: !!session }, "Session encrypted");

    return session;
}

export async function decryptSession(
    session: string | undefined = "",
): Promise<SessionPayload & JWTPayload> {
    const child = logger.child({ function: decryptSession.name });

    try {
        const { payload } = await jwtVerify<SessionPayload>(
            session,
            encodedKey,
            {
                algorithms: ["HS256"],
            },
        );
        return payload;
    } catch (error) {
        if (error instanceof errors.JWTExpired) {
            child.warn("Session expired");
            throw new SessionExpiredError();
        }

        child.warn({ error }, "Session invalid or malformed");
        throw new SessionInvalidError();
    }
}

export async function createSession(payload: SessionPayload): Promise<void> {
    const child = logger.child({ function: createSession.name });
    child.trace({ userId: payload.id }, "Creating new session");

    const session = await encryptSession(payload);
    const cookieStore = await cookies();

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + SESSION_LIFE_SPAN_MILLIS),
        sameSite: "lax",
        path: "/",
    });

    child.trace(
        {
            tokenPresent: !!session,
        },
        "Session created",
    );
}

export async function updateSession(): Promise<void> {
    const child = logger.child({ function: updateSession.name });
    child.trace("Refreshing session");

    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
        child.warn("No session cookie found");
        return;
    }

    try {
        const payload = await decryptSession(session);

        const expiresAt = new Date(Date.now() + SESSION_LIFE_SPAN_MILLIS);
        const newSession = await encryptSession(payload);

        cookieStore.set("session", newSession, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            sameSite: "lax",
            path: "/",
        });

        child.trace(
            { userId: payload.id, exp: expiresAt },
            "Session refreshed",
        );
    } catch (error) {
        if (error instanceof SessionExpiredError) {
            child.warn("Session expired during refresh");
        } else if (error instanceof SessionInvalidError) {
            child.warn("Invalid session during refresh");
        } else {
            child.error({ error }, "Unexpected error during session refresh");
        }
    }
}

export async function deleteSession(): Promise<void> {
    const child = logger.child({ function: deleteSession.name });
    child.trace("Deleting session");

    const cookieStore = await cookies();
    cookieStore.delete("session");

    child.trace("Session deleted");
}

export type SessionAuth =
    | {
          isAuth: true;
          id: number;
          username: string;
          role: Role;
      }
    | { isAuth: false };

export const verifySession = cache(async function (): Promise<SessionAuth> {
    const cookie = (await cookies()).get("session")?.value;

    try {
        const session = await decryptSession(cookie);
        return {
            isAuth: true,
            id: session.id,
            username: session.username,
            role: session.role,
        };
    } catch (error) {
        return { isAuth: false };
    }
});
