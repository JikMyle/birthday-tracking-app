"use client";
import { CalendarDays, CalendarSync, HatGlasses, Tally5 } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function LandingPage() {
    return (
        <section className="flex flex-col items-center w-full min-h-screen font-sans overflow-auto text-base-content p-8 bg-linear-30 from-white to-primary-content">
            <h1 className="mt-16 text-4xl md:text-6xl font-black text-center">
                How big is
                <br className="md:hidden" /> today's{" "}
                <br className="md:hidden" />
                <span className="text-primary">birthday&nbsp;bash?</span>
            </h1>

            <h2 className="mt-6 text-lg md:max-w-xl text-base-content/50 text-center">
                BDBashboard lets you take a look at how many people are
                celebrating their birthdays across the year, all in one place.
            </h2>

            <h2 className="my-6 text-lg text-base-content/50 text-center">
                Sign up now to join the party!
            </h2>

            <Link
                className="btn btn-primary btn-lg"
                aria-label="Explore the Calendar"
                href={"/login"}
            >
                Explore the Calendar
            </Link>

            <section className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] w-full md:max-w-6xl mt-24 mb-16 gap-8">
                <div className="flex flex-col col-span-full items-center gap-4">
                    <h3 className="text-3xl w-min md:w-max text-center font-bold">
                        Crafted for Celebration
                    </h3>
                    <h4 className="text-center text-base-content/50">
                        Experience a dashboard that prioritizes joy and social
                        connection over simple data entry
                    </h4>
                </div>

                <Card
                    key={"Calendar-centric focus"}
                    icon={
                        <CardIcon
                            className="bg-primary-content text-primary"
                            icon={<CalendarDays />}
                        />
                    }
                    title="Calendar-centric focus"
                    description="A simple and intuitive calendar interface that visualizes everyone's key moments across months and seasons"
                />

                <Card
                    key={"Numeric birthday counts"}
                    icon={
                        <CardIcon
                            className="bg-secondary-content text-secondary"
                            icon={<Tally5 />}
                        />
                    }
                    title="Numeric birthday counts"
                    description="Instantly see days with active celebrations with our badge indicators."
                />

                <Card
                    key={"Month/Year toggling"}
                    icon={
                        <CardIcon
                            className="bg-primary-content text-primary"
                            icon={<CalendarSync />}
                        />
                    }
                    title="Month/Year toggling"
                    description="Seamless glide from daily to montly. Toggle between granular daily birthdays and birds-eye monthly celebrations with one click."
                />

                <Card
                    key={"Complete anonymity"}
                    icon={
                        <CardIcon
                            className="bg-secondary-content text-secondary"
                            icon={<HatGlasses />}
                        />
                    }
                    title="Complete anonymity"
                    description="Too shy to show the world. Don't worry! Celebrants are kept secret, you'll just know that someone, somewhere, is having a blast."
                />
            </section>

            <p className="text-sm text-base-content/50 mb-4">
                Don't have an account?
            </p>
            <Link className="btn btn-primary btn-lg" href={"/signup"}>
                Create Your Account
            </Link>
        </section>
    );
}

interface CardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

function Card({ icon, title, description: body }: CardProps) {
    return (
        <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
                {icon}
                <h5 className="card-title">{title}</h5>

                <p className="font-thin">{body}</p>
            </div>
        </div>
    );
}

interface CardIconProps {
    className: string;
    icon: ReactNode;
}

function CardIcon({ className, icon }: CardIconProps) {
    return (
        <div className={`p-3 mb-2 rounded-full w-fit ${className}`}>{icon}</div>
    );
}
