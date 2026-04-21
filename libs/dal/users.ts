import prisma from "../db/prisma";
import { encryptPassword } from "../bcrypt";
import {
    CreateUserInput,
    UpdateUserInfoInput,
} from "../validation/userSchemas";
import { PublicUser, UserSummary } from "../types";
import logger from "../logger";

export type BatchPayload = { count: number };

export async function createUser(user: CreateUserInput): Promise<UserSummary> {
    const child = logger.child({ function: createUser.name });
    child.trace({ username: user.username }, "Creating new user");

    const { confirmPassword, ...withHashedPassword } = {
        ...user,
        password: await encryptPassword(user.password),
    };

    try {
        const user = await prisma.user.create({
            data: withHashedPassword,
            select: {
                id: true,
                username: true,
                email: true,
                birthdate: true,
                emailPreference: true,
            },
        });

        child.info({ userId: user.id }, "User successfully created");
        return user;
    } catch (error) {
        child.error({ error }, "Failed to create user");
        throw error;
    }
}

export async function getUsers(
    keyword: string | null,
    deleted: boolean,
    page: number,
    pageSize: number,
): Promise<PublicUser[]> {
    const child = logger.child({
        function: getUsers.name,
        keyword: keyword,
        deleted: deleted,
        page: page,
        pageSize: pageSize,
    });
    child.trace("Fetching users");

    try {
        const users = await prisma.user.findMany({
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

        child.trace({ count: users.length }, "Users successfully fetched");
        return users;
    } catch (error) {
        child.warn({ error }, "Failed to fetch users");
        throw error;
    }
}

export async function getUserById(id: number): Promise<PublicUser | null> {
    const child = logger.child({ function: getUserById.name, userId: id });
    child.trace("Fetching user");

    try {
        const user = await prisma.user.findUnique({
            where: { id, deletedAt: null },
            omit: { password: true },
        });

        if (user) {
            child.trace("User successfully fetched");
        } else {
            child.warn("No user found with matching ID");
        }

        return user;
    } catch (error) {
        child.error({ error }, "Failed to fetch user");
        throw error;
    }
}

export async function deleteUserById(id: number): Promise<void> {
    const child = logger.child({ function: deleteUserById.name, userId: id });
    child.trace("Deleting user");

    try {
        const deleted = await prisma.user.delete({
            where: { id, deletedAt: null },
            omit: { password: true },
        });

        child.info("User successfully deleted");
    } catch (error) {
        child.error({ error: error }, "Failed to delete user");
        throw error;
    }
}

export async function updateUserById(
    id: number,
    data: UpdateUserInfoInput,
): Promise<UserSummary> {
    const child = logger.child({ function: updateUserById.name, userId: id });
    child.trace(
        {
            usernamePresent: !!data.username,
            birthdatePresent: !!data.birthdate,
            emailPreferencePresent: !!data.emailPreference,
        },
        "Updating user",
    );

    try {
        const updated = await prisma.user.update({
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

        child.info("User successfully updated");

        return updated;
    } catch (error) {
        child.error({ error: error }, "Failed to update user");
        throw error;
    }
}

export async function softDeleteUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: softDeleteUsers.name });
    child.trace({ count: ids.length }, "Soft-deleting users");

    try {
        const deleted = await prisma.user.updateMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            data: {
                updatedAt: new Date(),
                deletedAt: new Date(),
            },
        });

        child.info(
            { targetCount: ids.length, affectedCount: deleted.count },
            "Users successfully soft-deleted",
        );

        return deleted;
    } catch (error) {
        child.error({ error }, "Failed to soft-delete users");
        throw error;
    }
}

export async function softDeleteUserById(id: number): Promise<BatchPayload> {
    const child = logger.child({
        function: softDeleteUserById.name,
        userId: id,
    });
    child.trace("Soft-deleting user");

    try {
        const deleted = await prisma.user.updateMany({
            where: { id, deletedAt: null },
            data: { updatedAt: new Date(), deletedAt: new Date() },
        });

        child.info("User successfully soft-deleted");

        return deleted;
    } catch (error) {
        child.error({ error: error }, "Failed to soft-delete user");
        throw error;
    }
}

export async function deleteUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: deleteUsers.name });
    child.trace({ count: ids.length }, "Deleting users");

    try {
        const deleted = await prisma.user.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        child.info(
            { targetCount: ids.length, affectedCount: deleted.count },
            "Users successfully deleted",
        );

        return deleted;
    } catch (error) {
        child.error({ error: error }, "Failed to delete users");
        throw error;
    }
}

export async function restoreUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: restoreUsers.name });
    child.trace({ count: ids.length }, "Restoring users");

    try {
        const restored = await prisma.user.updateMany({
            where: {
                id: { in: ids },
                deletedAt: { not: null },
            },
            data: {
                deletedAt: null,
                updatedAt: new Date(),
            },
        });

        child.info(
            { targetCount: ids.length, affectedCount: restored.count },
            "Users successfully restored",
        );

        return restored;
    } catch (error) {
        child.error({ error: error }, "Failed to restore users");
        throw error;
    }
}

export async function restoreUserById(id: number): Promise<BatchPayload> {
    const child = logger.child({
        function: restoreUserById.name,
        userId: id,
    });
    child.trace("Restoring user");

    try {
        const restored = await prisma.user.updateMany({
            where: { id, deletedAt: { not: null } },
            data: { updatedAt: new Date(), deletedAt: null },
        });

        child.trace("User successfully restored");

        return restored;
    } catch (error) {
        child.error({ error: error }, "Failed to restore user");
        throw error;
    }
}
