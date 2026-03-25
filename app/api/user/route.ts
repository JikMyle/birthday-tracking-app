import { Prisma } from "@/generated/prisma/client";
import errorHandler from "@/libs/errorHandler";
import { validateIdList } from "@/libs/validation/validators/validateIdList";
import validateNewUser from "@/libs/validation/validators/validateNewUser";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
) {
    const searchParams = request.nextUrl.searchParams;
    
    const keyword = searchParams.get('keyword');
    const deleted = searchParams.get('deleted') === 'true' ? true : false;

    const intOrDefault = (param: string | null, defaultValue: number): number => {
        if (param === null) return defaultValue;
        const num = Number(param);
        return Number.isInteger(num) && num > 0 ? num : defaultValue;
    }

    const page = intOrDefault(searchParams.get('page'), 1);
    const pageSize = intOrDefault(searchParams.get('pageSize'), 10);

    const generateGetFilters = (
        keyword: string | null, 
        deleted: boolean
    ): Prisma.UserWhereInput => {
        const filters: Prisma.UserWhereInput = {}

        if(keyword) {
            filters.OR = [
                { username: { contains: keyword }},
                { email: { contains: keyword }}
            ]
        }
        
        filters.deletedAt = null
        if(deleted) {
            filters.deletedAt = { not: null }
        }

        return filters;
    }

    try {
        const filters = generateGetFilters(keyword, deleted);
        const users = await prisma.user.findMany({
            where: filters,
            omit: { password: true },
            orderBy: { id: "asc" },
            take: pageSize,
            skip: pageSize * (page - 1)
        })

        return NextResponse.json(
            users,
            { status: 200 }
        )
    } catch ( error ) {
        return await errorHandler(error, "Failed to retrieve users");
    }
}

export async function POST(
    request: NextRequest
): Promise<NextResponse> {
    // NOTE: Handle email verification in the future
    
    const body = await request.json();
    const validatedUserData = validateNewUser(body);

    if(!validatedUserData.valid) { return validatedUserData.response }

    try {
        const newUser = await prisma.user.create({
            data: { 
                ...validatedUserData.data,
                id: 0,
                emailVerified: false,
                verificationToken: null,
                tokenExpiresAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            },
            omit: { password: true }
        }) 

        return NextResponse.json(
            newUser,
            { status: 200 }
        )
    } catch (error) {
        return await errorHandler(error, "Failed to create user");
    }
}

export async function PATCH(
    request: NextRequest
): Promise<NextResponse> {
    const body = await request.json();
    const validatedIds = validateIdList(body.ids);

    if(!validatedIds.valid) { return validatedIds.response }

    try {
        const deleted = await prisma.user.updateMany({
            where: {
                id: { in: validatedIds.data },
                deletedAt: null
            },
            data: {
                updatedAt: new Date(),
                deletedAt: new Date()
            }
        })

        return NextResponse.json(
            deleted,
            { status: 200 }
        )
    } catch (error) {
        return await errorHandler(error, "Failed to delete users");
    }
}

export async function DELETE(
    request: NextRequest
): Promise<NextResponse> {
    const body = await request.json()
    const validatedIds = validateIdList(body.ids);

    if(!validatedIds.valid) { return validatedIds.response }
    
    try {
        const deleted = await prisma.user.deleteMany({
            where: {
                id: { in: validatedIds.data }
            }
        })

        return NextResponse.json(
            deleted,
            { status: 200 }
        )
    } catch (error) {
        return await errorHandler(error, "Failed to delete users")
    }
}