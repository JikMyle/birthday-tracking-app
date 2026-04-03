"use client";
import { PartyPopper } from "lucide-react";
import { IconContainer } from "./IconContainer";

export function AppIcon({
    className,
    size = 32,
}: {
    className?: string;
    size?: number;
}) {
    return (
        <IconContainer className={`text-primary ${className ?? ""}`}>
            <PartyPopper size={size} />
        </IconContainer>
    );
}
