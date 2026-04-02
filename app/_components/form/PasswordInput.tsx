import { useState } from "react";
import { TextInputProps } from "./TextInput";
import Button from "../Button";
import { EyeClosed, EyeIcon } from "lucide-react";

export function PasswordInput({
    className,
    hasValidation,
    type,
    error,
    ...props
}: TextInputProps) {
    const [isPasswordShowing, setIsPasswordShowing] = useState(false);

    return (
        <div className="join">
            <div className="grow">
                <input
                    {...props}
                    type={isPasswordShowing ? "text" : "password"}
                    className={`input ${hasValidation && "validator"} join-item ${className ?? ""}`}
                />
                {error ? <div className="validator-hint">{error}</div> : null}
            </div>
            <Button
                className="join-item p-2"
                type="button"
                aria-label={
                    isPasswordShowing ? "Show password" : "Hide password"
                }
                onClick={() => setIsPasswordShowing(!isPasswordShowing)}
            >
                {isPasswordShowing ? <EyeIcon /> : <EyeClosed />}
            </Button>
        </div>
    );
}
