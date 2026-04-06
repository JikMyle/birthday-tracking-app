import { Role } from "@/generated/prisma/enums";
import { createUser } from "@/libs/dal/users";
import { validateSignUpInput } from "../../_actions";
import { NextRequest, NextResponse } from "next/server";
import errorHandler from "@/libs/errorHandler";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const validated = validateSignUpInput({
        ...body,
        role: Role.USER,
    });

    if (!validated.valid) {
        return validated.response;
    }

    try {
        const user = await createUser(validated.data);

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return await errorHandler(error);
    }
}
