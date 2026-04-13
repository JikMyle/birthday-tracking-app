import { BaseInput, BaseInputProps } from "./BaseInput";

export function TextInput({ className, error, ...props }: BaseInputProps) {
    return <BaseInput className={className} error={error} {...props} />;
}
