import { ReactNode } from "react";
import CalendarContextProvider from "./context/CalendarContextProvider";

export default function HomeLayout({
    children
}: { children: ReactNode }
): ReactNode {
    return (
        <CalendarContextProvider>
            { children }
        </CalendarContextProvider>
    )
}