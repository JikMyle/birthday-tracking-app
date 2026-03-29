import Spacer from "../_components/Spacer";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen w-screen bg-base-100 font-sans overflow-hidden bg-linear-30 from-white to-primary-content">
            <TopBar></TopBar>

            <main className="w-full h-full py-2 md:p-12 overflow-scroll">
                {children}
            </main>
        </div>
    );
}

function TopBar(): React.ReactNode {
    return (
        <header className="flex items-center w-full h-16 p-4 gap-4 shadow-md bg-white text-primary">
            <TopBarTitle></TopBarTitle>
            <Spacer></Spacer>
            <TopBarGreeting></TopBarGreeting>
            <Avatar src="/"></Avatar>
        </header>
    );
}

function TopBarTitle(): React.ReactNode {
    return <span className="text-3xl font-black">BDBashboard</span>;
}

function TopBarGreeting(): React.ReactNode {
    return (
        <div className="max-sm:hidden flex flex-col items-end text-primary-content max-w-[25ch]">
            <span className="leading-4 font-light">Hello,</span>
            <span className="leading-4 truncate font-bold">Your username</span>
        </div>
    );
}

function Avatar({ src }: { src: string }): React.ReactNode {
    return (
        <img
            className="h-12 w-12 rounded-full bg-primary-content object-cover text-primary text-xs"
            src={src}
            alt="Avatar"
        />
    );
}
