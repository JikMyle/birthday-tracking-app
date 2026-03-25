import errorHandler from "@/libs/errorHandler";
import validateId from "@/libs/validation/validators/validateId";
import validatePartialUser from "@/libs/validation/validators/validatePartialUser";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: Promise<{
        id: number
    }>
}

export async function GET(
    request: NextRequest,
    { params }: Params
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if(!validated.valid) return validated.response;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: validated.value, deletedAt: null },
            omit: { password: true }
        })

        if(!user) {
            return NextResponse.json(
                { message: "No user record found"}, 
                { status: 404 }
            )
        }

        return NextResponse.json(
            user,
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error, "Failed to fetch user")
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
): Promise<NextResponse> {
    const { id } = await params;
    const validated = validateId(id);

    if(!validated.valid) return validated.response;

    try {
        await prisma.user.delete({
            where: { id: validated.value, deletedAt: null },
            omit: { password: true }
        })

        return new NextResponse(null, { status: 204 })
    } catch(error) {
        return await errorHandler(error, "Failed to delete user")
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    const { id } = await params;
    const validatedId = validateId(id);

    if(!validatedId.valid) return validatedId.response;

    const json = await request.json()
    const validatedUserData = validatePartialUser(json)

    if(!validatedUserData.valid) return validatedUserData.response;
    console.log(validatedUserData.data)

    try {
        const result = await prisma.user.update({
            where: { id: validatedId.value, deletedAt: null },
            data: {
                ...validatedUserData.data,
                updatedAt: new Date()
            },
            omit: { password: true }
        })

        return NextResponse.json(
            result,
            { status: 200 }
        )
    } catch(error) {
        return await errorHandler(error);
    }
}