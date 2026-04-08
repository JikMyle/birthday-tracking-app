import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "./_components/Footer";
import { ReactQueryClientProvider } from "./_components/ReactQueryClientProvider";
import { ThemeProvider } from "next-themes";

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
            <html lang="en" suppressHydrationWarning>
                <body
                    className={`${plusJakarta.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen 
                        bg-linear-0 md:bg-radial-[at_50%_100%] from-primary/30 to-50% to-base-100 dark:from-primary bg-fixed`}
                >
                    <ThemeProvider
                        attribute={"data-theme"}
                        enableSystem={false}
                    >
                        {children}
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ReactQueryClientProvider>
    );
}
