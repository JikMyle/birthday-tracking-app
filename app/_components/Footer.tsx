"use client";

import { PartyPopper } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="min-h-16 p-2 flex flex-col justify-center items-center bg-base-100 text-base-content">
            <Link href={"/"}>
                <h3 className="text-xl font-bold text-primary">
                    <PartyPopper className="inline-block mr-1" />
                    BDBashboard
                </h3>
            </Link>
            <p className="label text-sm">
                © BDBashboard 2026. Jim Kyle Lauderes
            </p>
        </footer>
    );
}
