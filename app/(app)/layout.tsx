import { TopBar } from "../_components/Header";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen w-full bg-base-100 font-sans overflow-hidden bg-linear-30 from-white to-primary-content">
            <TopBar></TopBar>

            <main className="w-full h-full py-2 md:p-12 overflow-scroll">
                {children}
            </main>
        </div>
    );
}
