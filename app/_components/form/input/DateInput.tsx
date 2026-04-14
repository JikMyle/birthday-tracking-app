import { Dispatch, useEffect, useState } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { checkRequired } from "./inputValidation";

export interface DateInputProps extends BaseInputProps {
    error?: string;
    type: "date" | "month" | "week";
}

export function DateInput({
    className,
    required,
    error,
    onBlur,
    submitCount,
    ...props
}: DateInputProps) {
    // Inner error corresponds to validation errors defined directly by input props
    // When null, allows the externally passed error to show via the ?? operator
    // When set to a validation error string, overrides the externally passed error
    const [innerError, setInnerError] = useState<string | null>(null);

    useEffect(() => {
        error && setInnerError(null);
    }, [error, submitCount]);

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

// Formats a raw date/month/week string into a readable label for error messages
function formatBound(value: string, type: string): string {
    if (!isNaN(Date.parse(value))) {
        if (type === "month") {
            // "2025-01" → "January 2025"
            const [year, month] = value.split("-");
            return new Date(Number(year), Number(month) - 1).toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "long",
                },
            );
        }
        if (type === "week") {
            // "2025-W03" → "Week 3, 2025"
            const [year, week] = value.split("-W");
            return `Week ${Number(week)}, ${year}`;
        }
        // "2025-01-15" → locale date string
        return new Date(value).toLocaleDateString();
    }
    return value;
}

function handleErrors(
    target: HTMLInputElement,
    dispatch: Dispatch<string | null>,
) {
    const value = target.value;
    const type = target.type;

    // --- Required ---
    const required = checkRequired(target);
    if (required) {
        dispatch("This field is required");
        return;
    }

    if (!value) {
        dispatch("");
        return;
    }

    // --- Date validity ---
    const date = new Date(value);

    if (isNaN(date.getTime())) {
        dispatch("Enter a valid date");
        return;
    }

    const min = target.min ? new Date(target.min) : null;
    const max = target.max ? new Date(target.max) : null;

    // --- Min / Max ---
    if (min && max && (date < min || date > max)) {
        dispatch(
            `Date must be between ${formatBound(target.min, type)} and ${formatBound(target.max, type)}`,
        );
        return;
    }

    if (min && date < min) {
        dispatch(`Date must be on or after ${formatBound(target.min, type)}`);
        return;
    }

    if (max && date > max) {
        dispatch(`Date must be on or before ${formatBound(target.max, type)}`);
        return;
    }

    dispatch("");
}
