"use client";
import { ReactNode } from "react";

export function IconContainer({ className, children }: IconProps) {
    return (
        <div className={`p-2 rounded-full w-fit ${className ?? ""}`}>
            {children}
        </div>
    );
}
export interface IconProps {
    className?: string;
    children: ReactNode;
}
