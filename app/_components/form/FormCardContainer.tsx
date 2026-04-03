"use client";
import { PropsWithChildren, ReactNode } from "react";

export function FormCardContainer({
    children,
    className,
    action,
}: PropsWithChildren<React.HTMLProps<HTMLFormElement>>): ReactNode {
    return (
        <form
            action={action}
            className={`flex flex-col p-8 bg-base-100 shadow-md rounded-xl overflow-hidden ${className ?? ""}`}
        >
            {children}
        </form>
    );
}
