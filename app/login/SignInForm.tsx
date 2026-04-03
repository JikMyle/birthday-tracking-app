"use client";
import { useActionState, useEffect } from "react";
import Button from "../_components/Button";
import Link from "next/link";
import Alert from "../_components/Alert";
import { login } from "./_actions";
import { TextInput } from "../_components/form/TextInput";
import { InputLabelContainer } from "../_components/form/InputLabelContainer";
import { PasswordInput } from "../_components/form/PasswordInput";
import { useRouter } from "next/navigation";
import { FormCardContainer } from "../_components/form/FormCardContainer";

export interface FormState {
    errors: Record<string, string> | null;
    success: string | null;
}

const initialState: FormState = {
    errors: null,
    success: null,
};

export function SignInForm() {
    const [state, formAction, pending] = useActionState(login, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) router.push("/home");
    }, [state]);

    return (
        <FormCardContainer
            className="w-full md:w-sm max-md:py-0"
            action={formAction}
        >
            {state.success || state.errors ? (
                <Alert
                    className="grow mb-4"
                    type={
                        state.success
                            ? "success"
                            : state.errors
                              ? "error"
                              : undefined
                    }
                    style="soft"
                    text={state.success ?? state.errors?.form ?? ""}
                />
            ) : null}

            <InputLabelContainer label="Email Address">
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    minLength={1}
                    required={true}
                />
            </InputLabelContainer>

            <InputLabelContainer label="Password">
                <PasswordInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    minLength={6}
                    required={true}
                />
            </InputLabelContainer>

            <div className="flex justify-between text-xs mb-4 mt-10">
                <Link className="link link-primary link-hover" href={"/signup"}>
                    Don't have an account?
                </Link>

                <Link
                    className="link link-primary link-hover"
                    href={"/forgot-password"}
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                className="btn-primary"
                type="submit"
                disabled={pending}
                aria-disabled={pending}
            >
                {pending ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    "Sign In"
                )}
            </Button>
        </FormCardContainer>
    );
}
