"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useRef } from "react";

export function ReactQueryClientProvider({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const client = useRef(new QueryClient());

    return (
        <QueryClientProvider client={client.current}>
            {children}
        </QueryClientProvider>
    );
}
