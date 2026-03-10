import { Prisma } from "@/generated/prisma/client";
import errorHandler from "@/libs/api/errorHandler";
import { prisma } from "@/libs/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
) {
    const searchParams = request.nextUrl.searchParams;
    
    const keyword = searchParams.get('keyword') || null;
    const deleted = searchParams.get('deleted') === 'true' ? true : false;

    const pageParam = searchParams.get('page') || "";
    let page = Number.isInteger(+pageParam) ? Number(pageParam) : 1;
    page = (page < 0) ? 1 : page;

    const pageSizeParam = searchParams.get('pageSize') || "";
    let pageSize = Number.isInteger(+pageSizeParam) ? Number(pageSizeParam) : 10;
    pageSize = (pageSize < 1) ? 10 : pageSize;

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

function generateGetFilters(
    keyword: string | null, 
    deleted: boolean
): Prisma.UserWhereInput {
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

export async function POST(
    request: NextRequest
): Promise<NextResponse> {
    // NOTE: Handle email verification in the future
    
    const body = await request.json();
    const { id, createdAt, updatedAt, deletedAt, emailVerified, verificationToken, tokenExpiresAt, ...user } = body;

    try {
        const newUser = await prisma.user.create({
            data: { 
                ...user,
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
    const ids: number[] = body.ids || [];

    try {
        const deleted = await prisma.user.updateMany({
            where: {
                id: { in: ids },
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
    const ids: number[] = body.ids || [];

    try {
        const deleted = await prisma.user.deleteMany({
            where: {
                id: { in: ids }
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