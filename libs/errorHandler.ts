import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
} from "@/generated/prisma/internal/prismaNamespace";
import { NextResponse } from "next/server";

// NOTE: Improve error handling with specific messages for error cases
export default async function errorHandler(error: unknown, message?: string) {
    let response: NextResponse = NextResponse.json(
        {
            message: "Internal server error",
        },
        { status: 500 },
    );

    if (error instanceof PrismaClientInitializationError) {
        response = NextResponse.json(
            {
                message: "Service unavailable",
                details: "Failed to connect to database",
            },
            { status: 503 },
        );
    }

    if (error instanceof PrismaClientKnownRequestError) {
        response = handlePrismaClientKnownRequestError(error);
    }

    if (error instanceof PrismaClientUnknownRequestError) {
        response = NextResponse.json(
            {
                message: "Bad request",
            },
            { status: 400 },
        );
    }

    if (process.env.NODE_ENV === "development") {
        const clone = response.clone();

        console.log(
            "-----------------------------------------------------------------",
        );
        console.log(`Error message: ${(await clone.json()).message}`);
        console.error(error);
        console.log(
            "-----------------------------------------------------------------",
        );
    }

    return response;
}

function handlePrismaClientKnownRequestError(
    error: PrismaClientKnownRequestError,
): NextResponse {
    const code = error.code;
    console.log(`PrismaClientKnownRequestError Code: ${code}`);

    switch (code) {
        case "P2025":
            return NextResponse.json(
                { message: "No record was found" },
                { status: 404 },
            );

        case "P2002":
            const failedFields = error.meta?.target || "";

            return NextResponse.json(
                {
                    message: `Unique constraint failed on field: ${failedFields}`,
                },
                { status: 409 },
            );

        default:
            return NextResponse.json(
                { message: "Failed to access record" },
                { status: 400 },
            );
    }
}
