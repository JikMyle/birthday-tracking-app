import { ReactNode } from "react";

export interface InputLabelContainer {
    className?: string;
    label: string;
    htmlFor: string;
    children: ReactNode;
}

export function InputLabelContainer({
    className,
    label,
    htmlFor,
    children,
}: InputLabelContainer) {
    return (
        <label
            className={`fieldset text-neutral ${className ?? ""}`}
            htmlFor={htmlFor}
        >
            <span className="fieldset-legend">{label}</span>
            {children}
        </label>
    );
}
