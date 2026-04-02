"use client";

import { PartyPopper } from "lucide-react";

export function Footer() {
    return (
        <footer className="min-h-16 p-2 flex flex-col justify-center items-center bg-base-100 text-base-content">
            <h3 className="text-xl font-bold text-primary">
                <PartyPopper className="inline-block mr-1" />
                BdBashboard
            </h3>
            <p className="text-sm text-base-content/50">
                © BdBashboard 2026. Jim Kyle Lauderes
            </p>
        </footer>
    );
}
