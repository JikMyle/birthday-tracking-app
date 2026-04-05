import { deleteSession, verifySession } from "@/libs/dal/session";
import { NextResponse } from "next/server";

export async function POST() {
    deleteSession();
    const session = verifySession();

    if ((await session).isAuth) {
        return NextResponse.json(
            {
                message: "Failed to sign out",
            },
            { status: 500 },
        );
    }

    return NextResponse.json(
        {
            message: "Successfully signed out",
        },
        { status: 200 },
    );
}
