import errorHandler from "@/libs/errorHandler";
import validateId from "@/libs/validation/validators/validateId";
import { prisma } from "@/libs/db/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{
        id: number
    }>
}

export async function PATCH(
    request: Request, 
    { params }: Params
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if(!validated.valid) return validated.response;

    try {
        await prisma.user.update({
            where: { id: validated.value, deletedAt: null },
            data: { updatedAt: new Date(), deletedAt: new Date() },
            omit: { password: true }
        })

        return new NextResponse(null, { status: 204 })
    } catch(error) {
        return await errorHandler(error)
    }
}