import { verifySession } from "@/libs/dal/session";
import { TopBar } from "../_components/Header";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await verifySession();

    return (
        <>
            <TopBar
                username={
                    session.isAuth ? (session.username as string) : "Guest"
                }
            ></TopBar>
            <main className="relative flex flex-col md:p-12 min-h-screen w-full font-sans">
                {children}
            </main>
        </>
    );
}
