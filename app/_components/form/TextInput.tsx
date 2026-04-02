import React from "react";

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
    className?: string;
    hasValidation?: boolean;
    error?: string;
}
export function TextInput({
    className,
    hasValidation,
    error,
    ...props
}: TextInputProps) {
    return (
        <>
            <input
                {...props}
                className={`input ${hasValidation && "validator"} ${className ?? ""}`}
            />
            {error ? <div className="validator-hint">{error}</div> : null}
        </>
    );
}
