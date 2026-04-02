import { verifySession } from "@/libs/dal/session";
import { SignInForm } from "./SignInForm";

export default async function Login() {
    const session = await verifySession();

    return (
        <main className="grow pt-16 md:pt-32 bg-linear-30 from-white to-primary-content">
            <SignInForm />
        </main>
    );
}
