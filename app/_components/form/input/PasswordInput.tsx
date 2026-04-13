import { useState } from "react";
import Button from "../../Button";
import { EyeClosed, EyeIcon } from "lucide-react";
import { BaseInput, BaseInputProps } from "./BaseInput";

export function PasswordInput({ className, error, ...props }: BaseInputProps) {
    const [isShowing, setIsPasswordShowing] = useState(false);

    return (
        <div className="join">
            <div className="grow">
                <BaseInput
                    {...props}
                    className={className}
                    error={error}
                    type={isShowing ? "text" : "password"}
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
