import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/db/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/libs/dal/session";
import errorHandler from "@/libs/errorHandler";
import { SignInInput, signInSchema } from "@/libs/validation/schemas";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validated = validateSignInInput(body.email, body.password);

    if (!validated.valid) {
        return validated.response;
    }

    try {
        const result = await prisma.user.findUnique({
            where: { email: validated.data.email },
            select: {
                id: true,
                password: true,
                username: true,
                role: true,
            },
        });

        if (
            !result ||
            !(await bcrypt.compare(validated.data.password, result.password))
        ) {
            throw new Error();
        }

        await createSession({
            id: result.id,
            username: result.username,
            role: result.role,
        });

        return NextResponse.json(
            {
                message: "Successfully signed in",
            },
            { status: 200 },
        );
    } catch (err) {
        return await errorHandler(err);
    }
}

function validateSignInInput(
    email: unknown,
    password: unknown,
):
    | { valid: true; data: SignInInput }
    | { valid: false; response: NextResponse } {
    const result = signInSchema.safeParse({
        email: email,
        password: password,
    });

    if (!result.success) {
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

    return {
        valid: true,
        data: { ...result.data },
    };
}
