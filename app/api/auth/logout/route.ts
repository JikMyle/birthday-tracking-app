import { deleteSession, verifySession } from "@/libs/dal/session";
import { NextResponse } from "next/server";

export async function GET() {
    deleteSession();
    const session = verifySession();

    if ((await session).isAuth) {
        return NextResponse.json(
            {
                message: "Failed to logout",
            },
            { status: 500 },
        );
    }

    return NextResponse.json(
        {
            message: "Successfully logged out",
        },
        { status: 200 },
    );
}
