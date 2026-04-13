import "server-only";

import { Role } from "@/generated/prisma/enums";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
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
): Promise<(SessionPayload & JWTPayload) | undefined> {
    const child = logger.child({ function: decryptSession.name });
    child.trace({ tokenPresent: !!session }, "Verifying session");
    try {
        const { payload } = await jwtVerify<SessionPayload>(
            session,
            encodedKey,
            {
                algorithms: ["HS256"],
            },
        );

        child.trace(
            {
                userId: payload.id,
                userRole: payload.role,
            },
            "Session verified",
        );
        return payload;
    } catch (error) {
        child.warn({ error }, "Failed to verify session");
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
    const payload = await decryptSession(session);

    if (!session || !payload) {
        child.warn("Failed to refresh session");
        return;
    }

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
        {
            userId: payload.id,
            exp: expiresAt,
        },
        "Session refreshed",
    );
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
    const session = await decryptSession(cookie);

    if (!session?.id) {
        return {
            isAuth: false,
        };
    }

    return {
        isAuth: true,
        id: session.id,
        username: session.username,
        role: session.role,
    };
});
