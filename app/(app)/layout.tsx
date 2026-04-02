import { TopBar } from "../_components/Header";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopBar></TopBar>
            <main className="relative flex flex-col md:p-12 min-h-screen w-full bg-base-100 font-sans bg-linear-30 from-white to-primary-content">
                {children}
            </main>
        </>
    );
}
