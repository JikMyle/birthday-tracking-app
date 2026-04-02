import Spacer from "./Spacer";

export function TopBar(): React.ReactNode {
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
