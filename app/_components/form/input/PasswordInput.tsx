import { Dispatch, useEffect, useState } from "react";
import Button from "../../Button";
import { EyeClosed, EyeIcon } from "lucide-react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { checkLength, checkPattern, checkRequired } from "./inputValidation";

export function PasswordInput({
    className,
    onBlur,
    error,
    submitCount,
    ...props
}: Omit<BaseInputProps, "type">) {
    // Inner error corresponds to validation errors defined directly by input props
    // When an empty string, prevents the externally passed error from showing
    const [innerError, setInnerError] = useState<string | null>(null);
    const [isShowing, setIsPasswordShowing] = useState(false);

    useEffect(() => {
        error && setInnerError(null);
    }, [error, submitCount]);

    return (
        <div className="join">
            <div className="grow">
                <BaseInput
                    {...props}
                    className={`join-item ${className ?? ""}`}
                    error={innerError ?? error}
                    type={isShowing ? "text" : "password"}
                    onBlur={(e) => {
                        handleErrors(e.currentTarget, setInnerError);
                        onBlur && onBlur(e);
                    }}
                />
            </div>
            <Button
                className="join-item p-2"
                type="button"
                aria-label={isShowing ? "Show password" : "Hide password"}
                onClick={() => setIsPasswordShowing(!isShowing)}
            >
                {isShowing ? <EyeIcon /> : <EyeClosed />}
            </Button>
        </div>
    );
}

function handleErrors(
    target: HTMLInputElement,
    dispatch: Dispatch<string | null>,
) {
    const value = target.value;

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
