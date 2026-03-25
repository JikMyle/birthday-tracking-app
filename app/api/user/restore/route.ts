import errorHandler from "@/libs/errorHandler";
import { validateIdList } from "@/libs/validation/validators/validateIdList";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest
): Promise<NextResponse> {
    const body = await request.json();
    const validatedIds = validateIdList(body.ids);

    if(!validatedIds.valid) { return validatedIds.response }

    try {
        const restored = await prisma.user.updateMany({
            where: {
                id: { in: validatedIds.data },
                deletedAt: { not: null }
            },
            data: {
                deletedAt: null,
                updatedAt: new Date()
            }
        })

        return NextResponse.json(
            restored,
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error, "Failed to restore users")
    }
}