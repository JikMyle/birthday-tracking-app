import { PartyPopperIcon } from "lucide-react";
import { IconContainer } from "../IconContainer";
import { ReactNode } from "react";

export default function FormWithHeaderContainer({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}): ReactNode {
    return (
        <section
            className={`flex flex-col items-center gap-8 ${className ?? ""}`}
        >
            <FormHeaderWithIcon
                title="Sign in to BDBashboard"
                icon={<PartyPopperIcon size={32} />}
            />

            {children}
        </section>
    );
}

function FormHeaderWithIcon({
    title,
    icon,
}: {
    title: string;
    icon: ReactNode;
}): ReactNode {
    return (
        <header className="flex flex-col items-center gap-2">
            <IconContainer className="bg-primary text-white">
                {icon}
            </IconContainer>

            <h3 className="text-2xl text-primary font-bold mx-auto">{title}</h3>
        </header>
    );
}
