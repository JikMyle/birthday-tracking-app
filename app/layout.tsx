import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ['latin']
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Happy Birthday",
  description: "A website that tells you many how many people are having a birthday today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}