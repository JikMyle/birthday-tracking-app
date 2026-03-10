import { 
    PrismaClientInitializationError, 
    PrismaClientKnownRequestError, 
    PrismaClientUnknownRequestError 
} from "@/generated/prisma/internal/prismaNamespace";
import { NextResponse } from "next/server";

// NOTE: Improve error handling with specific messages for error cases
export default async function errorHandler(
    error: unknown,
    message?: string
) {
    let response: NextResponse = NextResponse.json({
        message: "Internal server error"
    }, { status: 500 })

    if (error instanceof PrismaClientInitializationError) { 
        response = NextResponse.json({
            error: "Service unavailable",
            details: "Failed to connect to database"
        }, { status: 503 })
    }

    if (error instanceof PrismaClientKnownRequestError) {
        response = NextResponse.json({
            error: message
        }, { status: 400 })
    }

    if (error instanceof PrismaClientUnknownRequestError) {
        response = NextResponse.json({
            error: "Bad request"
        }, { status: 400 })
    }

    if(process.env.NODE_ENV === 'development') {
        const clone = response.clone()

        console.log("-----------------------------------------------------------------")
        console.log(`Error message: ${(await clone.json()).error}`)
        console.error(error)
        console.log("-----------------------------------------------------------------")
    }

    return response;
}