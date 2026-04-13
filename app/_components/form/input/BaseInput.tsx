import { HTMLProps } from "react";

export interface BaseInputProps extends HTMLProps<HTMLInputElement> {
    error?: string;
}

export function BaseInput({ className, error, ...props }: BaseInputProps) {
    return (
        <>
            <input
                {...props}
                className={`input text-base-content ${className ?? ""} ${error && "input-error"}`}
            />
            <div
                className={`validator-hint ${error ? "visible! text-error" : "hidden!"}`}
            >
                {error}
            </div>
        </>
    );
}
