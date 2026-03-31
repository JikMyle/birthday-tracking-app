import { Role } from "@/generated/prisma/enums";
import { createUser } from "@/libs/dal/users";
import validateNewUser from "@/libs/validation/validators/validateNewUser";
import { NextRequest, NextResponse } from "next/server";
import errorHandler from "@/libs/errorHandler";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const validated = validateNewUser({
        ...body,
        role: Role.USER,
    });

    if (!validated.valid) {
        return validated.response;
    }

    try {
        const user = await createUser({
            ...validated.data,
            id: 0,
            emailVerified: false,
            verificationToken: null,
            tokenExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return await errorHandler(error, "Failed to create user");
    }
}
