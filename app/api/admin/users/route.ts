import { validateIdList } from "@/libs/validation/validators/validateIdList";
import validateNewUser from "@/libs/validation/validators/validateNewUser";
import { NextRequest, NextResponse } from "next/server";
import { createUser, deleteUsers, getUsers } from "@/libs/dal/users";
import errorHandler from "@/libs/errorHandler";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const keyword = searchParams.get("keyword")?.trim() || null;
    const deleted = searchParams.get("deleted") === "true" ? true : false;

    const intOrDefault = (
        param: string | null,
        defaultValue: number,
    ): number => {
        if (param === null) return defaultValue;
        const num = Number(param);
        return Number.isInteger(num) && num > 0 ? num : defaultValue;
    };

    const page = intOrDefault(searchParams.get("page"), 1);
    const pageSize = intOrDefault(searchParams.get("pageSize"), 10);

    try {
        const users = await getUsers(keyword, deleted, page, pageSize);
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    // NOTE: Handle email verification in the future

    const body = await request.json();
    const validated = validateNewUser(body);

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
        return await errorHandler(error);
    }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const validatedIds = validateIdList(body.ids);

    if (!validatedIds.valid) {
        return validatedIds.response;
    }

    try {
        const result = await deleteUsers(validatedIds.data);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}
