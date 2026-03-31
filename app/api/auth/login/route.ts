import { NextRequest, NextResponse } from "next/server";
import { validateLoginCredentials } from "./_actions";
import { prisma } from "@/libs/db/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/libs/dal/session";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validated = validateLoginCredentials(body.email, body.password);

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

        if (!result) {
            throw new Error();
        }

        if (!(await bcrypt.compare(validated.data.password, result.password))) {
            throw new Error();
        }

        await createSession({
            id: result.id,
            username: result.username,
            role: result.role,
        });

        return NextResponse.json(
            {
                message: "Login successful",
            },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: "Invalid email or password",
            },
            { status: 400 },
        );
    }
}
