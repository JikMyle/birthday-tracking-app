"use client";
import { useActionState, useEffect } from "react";
import Button from "../_components/Button";
import Link from "next/link";
import Alert from "../_components/Alert";
import { signIn } from "./_actions";
import { TextInput } from "../_components/form/input/TextInput";
import { InputLabelContainer } from "../_components/form/input/InputLabelContainer";
import { PasswordInput } from "../_components/form/input/PasswordInput";
import { useRouter } from "next/navigation";
import { FormCardContainer } from "../_components/form/FormCardContainer";

export function SignInForm() {
    const [state, formAction, pending] = useActionState(signIn, {
        errors: null,
        success: null,
    });
    const router = useRouter();

    useEffect(() => {
        if (state.success) router.push("/home");
    }, [state]);

    return (
        <FormCardContainer
            className="w-full max-w-sm max-md:bg-transparent max-md:shadow-none max-md:py-0"
            action={formAction}
        >
            {state.success || state.errors?.form ? (
                <Alert
                    className="grow mb-4"
                    type={
                        state.success
                            ? "success"
                            : state.errors?.form
                              ? "error"
                              : undefined
                    }
                    style="soft"
                    text={state.success ?? state.errors?.form ?? ""}
                />
            ) : null}

            <InputLabelContainer label="Email Address" htmlFor="email">
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    minLength={1}
                    required={true}
                    error={state.errors?.email}
                />
            </InputLabelContainer>

            <InputLabelContainer label="Password" htmlFor="password">
                <PasswordInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    minLength={1}
                    required={true}
                    error={state.errors?.password}
                />
            </InputLabelContainer>

            <div className="flex justify-between text-xs mb-4 mt-10">
                <Link
                    className="link link-primary link-hover dark:text-base-content"
                    href={"/signup"}
                >
                    Don't have an account?
                </Link>

                <Link
                    className="link link-primary link-hover dark:text-base-content"
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
