import { softDeleteUsers } from "@/libs/dal/users";
import errorHandler from "@/libs/errorHandler";
import { validateIdList } from "@/app/api/_actions";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const validatedIds = validateIdList(body.ids);

    if (!validatedIds.valid) {
        return validatedIds.response;
    }

    try {
        const result = await softDeleteUsers(validatedIds.data);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return await errorHandler(error);
    }
}
