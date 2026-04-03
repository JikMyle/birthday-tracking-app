import { SignInForm } from "./SignInForm";

export default async function Login() {
    return (
        <main className="grow pt-16 md:pt-32 bg-linear-30 from-white to-primary-content">
            <SignInForm />
        </main>
    );
}
