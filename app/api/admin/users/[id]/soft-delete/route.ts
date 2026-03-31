import errorHandler from "@/libs/errorHandler";
import validateId from "@/libs/validation/validators/validateId";
import { NextResponse } from "next/server";
import { softDeleteUserById } from "@/libs/dal/users";

interface Params {
    params: Promise<{
        id: number;
    }>;
}

export async function PATCH(
    request: Request,
    { params }: Params,
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if (!validated.valid) return validated.response;

    try {
        const result = await softDeleteUserById(validated.value);

        if (result.count === 0) {
            return NextResponse.json(
                { message: "No user record found" },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return await errorHandler(error, "Failed to soft delete user");
    }
}
