import { ReactNode } from "react";
import { AppIcon } from "../_components/AppIcon";
import { FormHeader } from "../_components/form/FormHeader";
import SignUpForm from "./SignUpForm";

export default function SignUp(): ReactNode {
    return (
        <main className="flex flex-col items-center grow py-16 md:py-32 gap-8">
            <FormHeader
                icon={<AppIcon className="text-white bg-primary" />}
                title="Sign up for BDBashboard"
            />
            <SignUpForm />
        </main>
    );
}
