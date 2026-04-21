import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/db/prisma";
import { createSession } from "@/libs/dal/session";
import errorHandler from "@/libs/errorHandler";
import { SignInInput, signInSchema } from "@/libs/validation";
import { comparePassword } from "@/libs/bcrypt";
import logger from "@/libs/logger";

export async function POST(req: NextRequest) {
    const child = logger.child(
        {
            requestId: req.headers.get("x-request-id"),
            method: req.method,
            path: req.nextUrl.pathname,
        },
        { msgPrefix: "[HTTP] " },
    );

    child.trace("Received sign in request");

    const body = await req.json();
    const validated = validateSignInInput(body.email, body.password);

    if (!validated.valid) {
        return validated.response;
    }

    try {
        child.trace(
            { emailPresent: !!validated.data.email },
            "Fetching user with matching email",
        );

        const result = await prisma.user.findUniqueOrThrow({
            where: { email: validated.data.email },
            select: {
                id: true,
                password: true,
                username: true,
                role: true,
            },
        });

        const doesPasswordMatch = await comparePassword(
            validated.data.password,
            result?.password ?? "",
        );

        if (!doesPasswordMatch) {
            throw new Error("Invalid sign in credentials");
        }

        await createSession({
            id: result.id,
            username: result.username,
            role: result.role,
        });

        const res = NextResponse.json(
            {
                message: "Successfully signed in",
            },
            { status: 200 },
        );

        child.info(
            { userId: result.id, userRole: result.role },
            "User successfully signed in",
        );

        return res;
    } catch (err) {
        child.warn("Failed sign in attempt");
        return await errorHandler(err);
    }
}

function validateSignInInput(
    email: unknown,
    password: unknown,
):
    | { valid: true; data: SignInInput }
    | { valid: false; response: NextResponse } {
    const child = logger.child({ function: validateSignInInput.name });
    child.trace(
        { emailPresent: !!email, passwordPresent: !!password },
        "Validating sign in input",
    );

    const result = signInSchema.safeParse({
        email: email,
        password: password,
    });

    if (!result.success) {
        child.trace("Invalid sign in input received");

        return {
            valid: false,
            response: NextResponse.json(
                {
                    message: "Invalid email or password",
                },
                { status: 400 },
            ),
        };
    }

    child.trace(
        {
            emailPresent: !!result.data.email,
            passwordPresent: !!result.data.password,
        },
        "Successfully validated sign in input",
    );

    return {
        valid: true,
        data: { ...result.data },
    };
}
