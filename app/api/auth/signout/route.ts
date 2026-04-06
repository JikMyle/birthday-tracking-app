import { deleteSession } from "@/libs/dal/session";
import { NextResponse } from "next/server";

export async function DELETE() {
    await deleteSession();

    return NextResponse.json(
        {
            message: "Successfully signed out",
        },
        { status: 200 },
    );
}
