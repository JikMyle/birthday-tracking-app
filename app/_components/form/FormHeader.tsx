import { ReactNode } from "react";

export function FormHeader({
    title,
    icon,
}: {
    title: string;
    icon?: ReactNode;
}): ReactNode {
    return (
        <header className="flex flex-col items-center gap-2">
            {icon}
            <h3 className="text-2xl text-primary font-bold mx-auto">{title}</h3>
        </header>
    );
}
