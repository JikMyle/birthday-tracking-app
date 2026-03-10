import errorHandler from "@/libs/api/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest
): Promise<NextResponse> {
    const body = await request.json();
    const ids: number[] = body.ids || [];

    try {
        const restored = await prisma.user.updateMany({
            where: {
                id: { in: ids }
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