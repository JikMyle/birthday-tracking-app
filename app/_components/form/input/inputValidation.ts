export function checkRequired(
    target: HTMLInputElement,
    error?: string,
): string | null {
    if (target.required && !target.value) {
        return error ?? "This field is required";
    }

    return null;
}

export function checkPattern(
    target: HTMLInputElement,
    error?: string,
): string | null {
    const regex = new RegExp(`^(?:${target.pattern})$`);

    if (!regex.test(target.value)) {
        return (
            target.title || error || "Value does not match the required format"
        );
    }

    return null;
}

export function checkLength(
    target: HTMLInputElement,
    error?: {
        minLength?: string;
        maxLength?: string;
        range?: string;
    },
): string | null {
    const minLength = target.minLength;
    const maxLength = target.maxLength;
    const valueLength = target.value.length;

    if (
        maxLength > 0 &&
        minLength > 0 &&
        (valueLength > maxLength || valueLength < minLength)
    ) {
        return (
            error?.range ??
            `Must be within ${minLength} to ${maxLength} characters`
        );
    }

    if (maxLength > 0 && valueLength > maxLength) {
        return error?.maxLength ?? `Must be at most ${maxLength} characters`;
    }

    if (minLength > 0 && valueLength < minLength) {
        return error?.minLength ?? `Must be at least ${minLength} characters`;
    }

    return null;
}
