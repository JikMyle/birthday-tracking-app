"use client";
import { LogOutIcon } from "lucide-react";
import { AppIcon } from "./AppIcon";
import { DefaultAvatar } from "./DefaultAvatar";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { useRouter } from "next/navigation";

export function TopBar({ username }: { username: string }): React.ReactNode {
    return (
        <header className="z-10 font-sans flex items-center w-full h-16 p-4 gap-4 shadow-md bg-base-100 text-primary">
            <Title className="mr-auto"></Title>
            <Greeting username={username}></Greeting>
            <Avatar src=""></Avatar>
        </header>
    );
}

function Title({ className }: { className?: string }): React.ReactNode {
    return (
        <div className={`flex items-center text-primary ${className ?? ""}`}>
            <AppIcon className="hidden md:flex" />
            <Link href={"/"} className="text-3xl font-black">
                BDBashboard
            </Link>
        </div>
    );
}

function Greeting({
    className,
    username,
}: {
    className?: string;
    username: string;
}): React.ReactNode {
    return (
        <div
            className={`max-sm:hidden flex flex-col items-end leading-4 max-w-[25ch] ${className ?? ""}`}
        >
            <span className="font-light text-base-content">Welcome,</span>
            <span className="truncate font-bold text-primary">{username}</span>
        </div>
    );
}

function Avatar({ src }: { src: string }): React.ReactNode {
    const router = useRouter();
    const mutation = useMutation({
        mutationKey: ["signout"],
        mutationFn: async () => {
            const response = await fetch(api("/api/auth/signout"), {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to sign out. Please try again.");
            }

            router.push("/signin");
            return "Successfully signed out. Redirecting to sign in page.";
        },
    });

    const handleOnSignOut = function (e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <button
                popoverTarget="avatar-dropdown"
                className="avatar active:scale-95 cursor-pointer"
                style={{ anchorName: "--avatar-dropdown-anchor" }}
            >
                {src ? (
                    <img
                        className="w-10 h-10 p-2 rounded-full object-cover bg-primary-content text-primary text-xs"
                        src={src}
                        alt="Avatar"
                    />
                ) : (
                    <DefaultAvatar className="stroke-none w-10 p-2 rounded-full bg-primary-content text-primary" />
                )}
            </button>
            <nav>
                <ul
                    className="dropdown menu min-w-48 mt-2 rounded-box bg-base-100 shadow-sm"
                    popover="auto"
                    id="avatar-dropdown"
                    style={{ positionAnchor: "--avatar-dropdown-anchor" }}
                >
                    <li>
                        <a
                            className="text-base-content"
                            href=""
                            onClick={handleOnSignOut}
                        >
                            <LogOutIcon size={16} /> Sign out
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
}
