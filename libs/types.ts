export interface FormState {
    formData: Record<string, string | string[]> | null;
    errors: Record<string, string> | null;
    success: string | null;
}
