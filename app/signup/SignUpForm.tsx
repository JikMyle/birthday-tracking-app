"use client";
import {
    ChangeEvent,
    ReactNode,
    useActionState,
    useEffect,
    useState,
} from "react";
import { FormCardContainer } from "../_components/form/FormCardContainer";
import { useRouter } from "next/navigation";
import { signUpUser } from "./_actions";
import Alert from "../_components/Alert";
import { InputLabelContainer } from "../_components/form/input/InputLabelContainer";
import { TextInput } from "../_components/form/input/TextInput";
import Button from "../_components/Button";
import Link from "next/link";
import { PasswordInput } from "../_components/form/input/PasswordInput";
import { FormState } from "@/libs/types";
import { DateInput } from "../_components/form/input/DateInput";

export default function SignUpForm(): ReactNode {
    const [state, setState] = useState<FormState>({
        submitCount: 0,
        formData: {},
    });

    const [actionState, formAction, pending] = useActionState(signUpUser, {
        errors: null,
        success: null,
    });

    const router = useRouter();

    useEffect(() => {
        if (actionState.success) router.push("/signin");
    }, [actionState]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        setState((prev) => ({
            ...prev,
            formData: { ...state.formData, [name]: value },
        }));
    };

    const handleFormSubmit = (formData: FormData) => {
        setState((prev) => ({ ...prev, submitCount: prev.submitCount + 1 }));
        formAction(formData);
    };

    return (
        <FormCardContainer
            className="w-full max-w-sm max-md:bg-transparent max-md:shadow-none max-md:py-0"
            action={handleFormSubmit}
        >
            {actionState.success || typeof actionState.errors === "string" ? (
                <Alert
                    className="grow mb-4"
                    type={
                        actionState.success
                            ? "success"
                            : actionState.errors
                              ? "error"
                              : undefined
                    }
                    style="soft"
                    text={actionState.success ?? actionState.errors ?? ""}
                />
            ) : null}

            <InputLabelContainer label="Username" htmlFor="username">
                <TextInput
                    className="validator"
                    id="username"
                    name="username"
                    autoComplete="username"
                    minLength={2}
                    maxLength={25}
                    placeholder="Enter username"
                    required={true}
                    onChange={handleOnChange}
                    pattern="^(?=.*[a-zA-Z0-9])\w+$"
                    title="Must contain letters, numbers, or underscores, but cannot be underscores only."
                    defaultValue={state.formData.username}
                    error={actionState.errors?.username}
                    submitCount={state.submitCount}
                />
            </InputLabelContainer>

            <InputLabelContainer label="Email Address" htmlFor="email">
                <TextInput
                    className="validator"
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter email address"
                    minLength={1}
                    required={true}
                    onChange={handleOnChange}
                    title="Must be a valid email address"
                    defaultValue={state.formData.email}
                    error={actionState.errors?.email}
                    submitCount={state.submitCount}
                ></TextInput>
            </InputLabelContainer>

            <InputLabelContainer label="Date of Birth" htmlFor="birthdate">
                <DateInput
                    className="validator"
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    required={true}
                    min={new Date(1900, 0, 1).toISOString().split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={handleOnChange}
                    title="Birthday must be today or a past date"
                    defaultValue={state.formData.birthdate}
                    error={actionState.errors?.birthdate}
                    submitCount={state.submitCount}
                />
            </InputLabelContainer>

            <InputLabelContainer label="Password" htmlFor="password">
                <PasswordInput
                    className="validator"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    minLength={6}
                    maxLength={64}
                    required={true}
                    title="Password must be within 8 to 64 characters long"
                    error={actionState.errors?.password}
                    submitCount={state.submitCount}
                />
            </InputLabelContainer>

            <InputLabelContainer
                label="Confirm Password"
                htmlFor="confirmPassword"
            >
                <PasswordInput
                    className="validator"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Enter password again"
                    required={true}
                    title="Confirm password must match password"
                    error={actionState.errors?.confirmPassword}
                    submitCount={state.submitCount}
                />
            </InputLabelContainer>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Email Preference</legend>
                <div className="flex gap-4">
                    <label
                        className="flex items-center gap-2"
                        htmlFor="emailPreferenceNone"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceNone"
                            value={"none"}
                            required={true}
                            defaultChecked={
                                state.formData.emailPreference === "none"
                            }
                            onChange={handleOnChange}
                        />
                        None
                    </label>

                    <label
                        htmlFor="emailPreferenceServer"
                        className="flex items-center gap-2"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceServer"
                            value={"serveronly"}
                            defaultChecked={
                                state.formData.emailPreference === "serveronly"
                            }
                            onChange={handleOnChange}
                        />
                        Server Only
                    </label>

                    <label
                        htmlFor="emailPreferenceEveryone"
                        className="flex items-center gap-2"
                    >
                        <input
                            type="radio"
                            className="radio checked:radio-primary"
                            name="emailPreference"
                            id="emailPreferenceEveryone"
                            value={"everyone"}
                            defaultChecked={
                                state.formData.emailPreference === "everyone"
                            }
                            onChange={handleOnChange}
                        />
                        Everyone
                    </label>
                </div>
                <span className="label">
                    Who would you like to receive emails from?
                </span>
            </fieldset>

            <Link
                className="link link-primary link-hover dark:text-base-content text-xs mb-4 mt-10 w-fit"
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
