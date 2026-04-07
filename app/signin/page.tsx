import { AppIcon } from "../_components/AppIcon";
import { FormHeader } from "../_components/form/FormHeader";
import { SignInForm } from "./SignInForm";

export default async function SignIn() {
    return (
        <main className="flex flex-col items-center grow py-16 md:py-32 bg-linear-30 from-white to-primary-content gap-8">
            <FormHeader
                icon={<AppIcon className="text-white bg-primary" />}
                title="Sign in to BDBashboard"
            />
            <SignInForm />
        </main>
    );
}
