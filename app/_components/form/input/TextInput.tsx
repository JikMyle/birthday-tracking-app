import { Dispatch, useEffect, useState } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import {
    checkLength,
    checkPattern,
    checkRequired,
} from "@/app/_components/form/input/inputValidation";

export interface TextInputProps extends Omit<BaseInputProps, "type"> {
    type?: "text" | "search" | "url" | "email" | "tel" | "password";
}

export function TextInput({
    className,
    onBlur,
    error,
    ...props
}: TextInputProps) {
    // Inner error corresponds to validation errors defined directly by input props
    // When null, allows the externally passed error to show via the ?? operator
    // When set to a validation error string, overrides the externally passed error
    const [innerError, setInnerError] = useState<string | null>(null);

    useEffect(() => {
        error && setInnerError(null);
    }, [error]);

    return (
        <BaseInput
            className={className}
            error={innerError ?? error}
            onBlur={(e) => {
                handleErrors(e.currentTarget, setInnerError);
                onBlur && onBlur(e);
            }}
            {...props}
        />
    );
}

// If the field has been changed and is empty or valid,
// the inner error value is set to an empty string
function handleErrors(
    target: HTMLInputElement,
    dispatch: Dispatch<string | null>,
) {
    const value = target.value;
    const type = target.type;

    // --- Required ---
    const required = checkRequired(target);
    if (required) {
        dispatch(required);
        return;
    }

    // Nothing further to validate if the field is empty and not required
    if (!value) {
        dispatch("");
        return;
    }

    // --- Pattern / Regex ---
    if (target.pattern) {
        const pattern = checkPattern(target);
        if (pattern) {
            dispatch(pattern);
            return;
        }
    }

    // --- Email ---
    if (type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            dispatch("Enter a valid email address (e.g. user@example.com)");
            return;
        }
    }

    // --- URL ---
    if (type === "url") {
        try {
            new URL(value);
        } catch {
            dispatch("Enter a valid URL (e.g. https://example.com)");
            return;
        }
    }

    // --- Tel ---
    if (type === "tel") {
        const telRegex = /^\+?[0-9]{7,15}$/;
        if (!telRegex.test(value.replace(/[\s\-().]/g, ""))) {
            dispatch("Enter a valid phone number");
            return;
        }
    }

    // --- String length (text, search, password, tel) ---
    if (target.maxLength > 0 || target.minLength > 0) {
        const length = checkLength(target);
        if (length) {
            dispatch(length);
            return;
        }
    }

    dispatch("");
}
