import { prisma } from "../db/prisma";
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

        child.trace({ userId: user.id }, "User successfully created");
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
    child.trace("Fetching user by ID");

    try {
        const user = await prisma.user.findUnique({
            where: { id, deletedAt: null },
            omit: { password: true },
        });

        child.trace(
            user
                ? "Successfully fetched user with ID"
                : "No users found with matching ID",
        );

        return user;
    } catch (error) {
        child.error({ error }, "Failed to fetch user with ID");
        throw error;
    }
}

export async function deleteUserById(id: number): Promise<void> {
    const child = logger.child({ function: deleteUserById.name, userId: id });
    child.trace("Deleting user by ID");

    try {
        const deleted = await prisma.user.delete({
            where: { id, deletedAt: null },
            omit: { password: true },
        });

        child.trace("Successfully deleted user with ID");
    } catch (error) {
        child.error({ error: error }, "Failed to delete user with ID");
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
        "Updating user with ID",
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

        child.trace("Successfully updated user with ID");

        return updated;
    } catch (error) {
        child.error({ error: error }, "Failed to update user with ID");
        throw error;
    }
}

export async function softDeleteUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: softDeleteUsers.name });
    child.trace({ count: ids.length }, "Soft-deleting users with IDs");

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

        child.trace(
            { count: ids.length, deletedCount: deleted.count },
            "Successfully soft-deleted users with IDs",
        );

        return deleted;
    } catch (error) {
        child.error({ error }, "Failed to soft-delete users with IDs");
        throw error;
    }
}

export async function softDeleteUserById(id: number): Promise<BatchPayload> {
    const child = logger.child({
        function: softDeleteUserById.name,
        userId: id,
    });
    child.trace("Soft-deleting user with ID");

    try {
        const deleted = await prisma.user.updateMany({
            where: { id, deletedAt: null },
            data: { updatedAt: new Date(), deletedAt: new Date() },
        });

        child.trace("Successfully soft-deleted user with ID");

        return deleted;
    } catch (error) {
        child.error({ error: error }, "Failed to soft-delete user with ID");
        throw error;
    }
}

export async function deleteUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: deleteUsers.name });
    child.trace({ count: ids.length }, "Deleting users with IDs");

    try {
        const deleted = await prisma.user.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        child.trace(
            { count: ids.length, deletedCount: deleted.count },
            "Successfully deleted users with IDs",
        );

        return deleted;
    } catch (error) {
        child.error({ error: error }, "Failed to delete users with IDs");
        throw error;
    }
}

export async function restoreUsers(ids: number[]): Promise<BatchPayload> {
    const child = logger.child({ function: restoreUsers.name });
    child.trace({ count: ids.length }, "Restoring users with IDs");

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

        child.trace(
            { count: ids.length, restoredCount: restored.count },
            "Successfully restored users with IDs",
        );

        return restored;
    } catch (error) {
        child.error({ error: error }, "Failed to restore users with IDs");
        throw error;
    }
}

export async function restoreUserById(id: number): Promise<BatchPayload> {
    const child = logger.child({
        function: restoreUserById.name,
        userId: id,
    });
    child.trace("Restoring user with ID");

    try {
        const restored = await prisma.user.updateMany({
            where: { id, deletedAt: { not: null } },
            data: { updatedAt: new Date(), deletedAt: null },
        });

        child.trace("Successfully restored user with ID");

        return restored;
    } catch (error) {
        child.error({ error: error }, "Failed to restore user with ID");
        throw error;
    }
}
