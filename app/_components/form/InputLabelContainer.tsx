import { ReactNode } from "react";

export interface InputLabelContainer {
    className?: string;
    label?: string;
    children: ReactNode;
}

export function InputLabelContainer({
    className,
    label,
    children,
}: InputLabelContainer) {
    return (
        <fieldset className={`fieldset text-neutral ${className ?? ""}`}>
            <legend className="fieldset-legend">{label}</legend>
            {children}
        </fieldset>
    );
}
