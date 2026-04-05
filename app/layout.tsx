import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "./_components/Footer";
import { ReactQueryClientProvider } from "./_components/ReactQueryClientProvider";

const plusJakarta = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BDBashboard",
    description: "A place to see how big the birthday bash is today.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" data-theme="light">
                <body
                    className={`${plusJakarta.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen`}
                >
                    {children}
                    <Footer />
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
