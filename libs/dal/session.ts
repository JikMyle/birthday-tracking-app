import "server-only";

import { Role } from "@/generated/prisma/enums";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export interface SessionPayload extends JWTPayload {
    id: number;
    username: string;
    role: Role;
}

export async function encryptSession(payload: SessionPayload) {
    return new SignJWT(payload)
        .setExpirationTime("3hr")
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .sign(encodedKey);
}

export async function decryptSession(session: string | undefined = "") {
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
        console.log("Failed to verify session");
    }
}

export async function createSession(payload: SessionPayload) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 3 * 1000);
    const session = await encryptSession({
        ...payload,
        exp: expiresAt.getMilliseconds(),
    });
    const cookieStore = await cookies();

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function updateSession() {
    const session = (await cookies()).get("session")?.value;
    const payload = await decryptSession(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export const verifySession = cache(async function (): Promise<
    | {
          isAuth: true;
          id?: number;
          username?: string;
          role?: Role;
      }
    | { isAuth: false }
> {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decryptSession(cookie);

    if (!session?.id) {
        return {
            isAuth: false,
        };
    }

    return {
        isAuth: true,
        id: session?.id,
        username: session?.username,
        role: session?.role,
    };
});
