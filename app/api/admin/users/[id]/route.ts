import errorHandler from "@/libs/errorHandler";
import validateId from "@/libs/validation/validators/validateId";
import validateUserInfo from "@/libs/validation/validators/validateUserInfo";
import { getUserById, deleteUserById, updateUserById } from "@/libs/dal/users";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{
        id: number;
    }>;
}

export async function GET(
    req: NextRequest,
    { params }: Params,
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if (!validated.valid) return validated.response;

    try {
        const user = await getUserById(validated.value);

        if (!user) {
            return NextResponse.json(
                { message: "No user record found" },
                { status: 404 },
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: Params,
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if (!validated.valid) return validated.response;

    try {
        await deleteUserById(validated.value);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return await errorHandler(error);
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const validatedId = validateId(id);

    if (!validatedId.valid) return validatedId.response;

    const json = await req.json();
    const validatedUserData = validateUserInfo(json);

    if (!validatedUserData.valid) return validatedUserData.response;

    try {
        const result = await updateUserById(
            validatedId.value,
            validatedUserData.data,
        );
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}
