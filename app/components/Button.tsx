import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
    className?: string
}

export default function Button({ 
    className,
    children,
    ...props
}: ButtonProps): ReactNode {
    return (
        <button className={`btn duration-100 ${className ?? ""}`}
            {...props}>
            { children }
        </button>
    )
}