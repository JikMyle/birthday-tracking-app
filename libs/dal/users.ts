import { prisma } from "../db/prisma";
import { encryptPassword } from "../encryptPassword";
import {
    CreateUserInput,
    UpdateUserInfoInput,
} from "../validation/userSchemas";
import { PublicUser, UserSummary } from "../types";

export type BatchPayload = { count: number };

export async function createUser(user: CreateUserInput): Promise<UserSummary> {
    const { confirmPassword, ...withHashedPassword } = {
        ...user,
        password: await encryptPassword(user.password),
    };

    return prisma.user.create({
        data: withHashedPassword,
        select: {
            id: true,
            username: true,
            email: true,
            birthdate: true,
            emailPreference: true,
        },
    });
}

export async function getUsers(
    keyword: string | null,
    deleted: boolean,
    page: number,
    pageSize: number,
): Promise<PublicUser[]> {
    return prisma.user.findMany({
        where: {
            OR: [
                { username: keyword ? { contains: keyword } : { not: "" } },
                { email: keyword ? { contains: keyword } : { not: "" } },
            ],
            deletedAt: deleted ? { not: null } : null,
        },
        omit: { password: true },
        orderBy: { id: "asc" },
        take: pageSize,
        skip: pageSize * (page - 1),
    });
}

export async function getUserById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { id, deletedAt: null },
        omit: { password: true },
    });
}

export async function deleteUserById(id: number): Promise<void> {
    await prisma.user.delete({
        where: { id, deletedAt: null },
        omit: { password: true },
    });
}

export async function updateUserById(
    id: number,
    data: UpdateUserInfoInput,
): Promise<UserSummary> {
    return prisma.user.update({
        where: { id, deletedAt: null },
        data: {
            ...data,
            updatedAt: new Date(),
        },
        select: {
            id: true,
            username: true,
            email: true,
            birthdate: true,
            emailPreference: true,
        },
    });
}

export async function softDeleteUsers(ids: number[]): Promise<BatchPayload> {
    return prisma.user.updateMany({
        where: {
            id: { in: ids },
            deletedAt: null,
        },
        data: {
            updatedAt: new Date(),
            deletedAt: new Date(),
        },
    });
}

export async function softDeleteUserById(id: number): Promise<BatchPayload> {
    return prisma.user.updateMany({
        where: { id, deletedAt: null },
        data: { updatedAt: new Date(), deletedAt: new Date() },
    });
}

export async function deleteUsers(ids: number[]): Promise<BatchPayload> {
    return prisma.user.deleteMany({
        where: {
            id: { in: ids },
        },
    });
}

export async function restoreUsers(ids: number[]): Promise<BatchPayload> {
    return prisma.user.updateMany({
        where: {
            id: { in: ids },
            deletedAt: { not: null },
        },
        data: {
            deletedAt: null,
            updatedAt: new Date(),
        },
    });
}

export async function restoreUserById(id: number): Promise<BatchPayload> {
    return prisma.user.updateMany({
        where: { id, deletedAt: { not: null } },
        data: { updatedAt: new Date(), deletedAt: null },
    });
}
