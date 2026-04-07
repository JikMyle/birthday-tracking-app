"use client";
import { ReactNode, useActionState, useEffect } from "react";
import { FormCardContainer } from "../_components/form/FormCardContainer";
import { useRouter } from "next/navigation";
import { signUpUser } from "./_actions";
import Alert from "../_components/Alert";
import { InputLabelContainer } from "../_components/form/InputLabelContainer";
import { TextInput } from "../_components/form/TextInput";
import Button from "../_components/Button";
import Link from "next/link";
import { PasswordInput } from "../_components/form/PasswordInput";

export default function SignUpForm(): ReactNode {
    const [state, formAction, pending] = useActionState(signUpUser, {
        formData: null,
        errors: null,
        success: null,
    });
    const router = useRouter();

    useEffect(() => {
        if (state.success) router.push("/login");
    }, [state]);

    return (
        <FormCardContainer
            className="w-full max-w-sm max-md:bg-transparent max-md:shadow-none max-md:py-0"
            action={formAction}
        >
            {state.success || typeof state.errors === "string" ? (
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
                    text={state.success ?? state.errors ?? ""}
                />
            ) : null}

            <InputLabelContainer label="Username" htmlFor="username">
                <TextInput
                    id="username"
                    name="username"
                    autoComplete="username displayname profilename accountname"
                    minLength={2}
                    placeholder="Enter username"
                    required={true}
                    hasValidation={true}
                    error={state.errors?.username ?? undefined}
                    title="Username must be equal to or between 2 to 25 characters long"
                />
            </InputLabelContainer>

            <InputLabelContainer label="Email Address" htmlFor="email">
                <TextInput
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter email address"
                    minLength={1}
                    required={true}
                    hasValidation={true}
                    error={state.errors?.email ?? undefined}
                    title="Must be a valid email address"
                ></TextInput>
            </InputLabelContainer>

            <InputLabelContainer label="Birthday" htmlFor="birthdate">
                <TextInput
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    autoComplete="birthday birthdate dateofbirth bday"
                    required={true}
                    hasValidation={true}
                    error={state.errors?.birthdate ?? undefined}
                    title="Birthday must be today or a past date"
                ></TextInput>
            </InputLabelContainer>

            <InputLabelContainer label="Password" htmlFor="password">
                <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    minLength={6}
                    maxLength={64}
                    required={true}
                    hasValidation={true}
                    title="Password must be within 8 to 64 characters long"
                />
            </InputLabelContainer>

            <InputLabelContainer
                label="Confirm Password"
                htmlFor="confirmPassword"
            >
                <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter password again"
                    required={true}
                    hasValidation={true}
                    title="Confirm password must match password"
                />
            </InputLabelContainer>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Email Preference</legend>
                <div className="flex gap-4">
                    <label
                        className="flex items-center gap-2 text-neutral"
                        htmlFor="emailPreferenceNone"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceNone"
                            value={"none"}
                            required={true}
                        />
                        None
                    </label>

                    <label
                        htmlFor="emailPreferenceServer"
                        className="flex items-center gap-2 text-neutral"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceServer"
                            value={"serveronly"}
                        />
                        Server Only
                    </label>

                    <label
                        htmlFor="emailPreferenceEveryone"
                        className="flex items-center gap-2 text-neutral"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceEveryone"
                            value={"everyone"}
                        />
                        Everyone
                    </label>
                </div>
                <span className="text-base-content/50 label">
                    Who would you like to receive emails from?
                </span>
            </fieldset>

            <Link
                className="link link-primary link-hover text-xs mb-4 mt-10 w-fit"
                href={"/signin"}
            >
                Already have an account?
            </Link>

            <Button
                className={`btn-primary ${pending && "btn-disabled"}`}
                type="submit"
                disabled={pending}
            >
                {pending ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    "Sign Up"
                )}
            </Button>
        </FormCardContainer>
    );
}
