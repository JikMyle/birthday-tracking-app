"use client";
import {
    CalendarDays,
    CalendarSync,
    HatGlasses,
    MenuIcon,
    Tally5,
    XIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AppIcon } from "./AppIcon";
import { IconContainer } from "./IconContainer";

export default function LandingPage() {
    return (
        <>
            <header className="sticky top-0 z-10 font-sans flex items-center w-full h-16 p-4 gap-4 shadow-md bg-white text-primary">
                <div className="flex items-center mr-auto">
                    <AppIcon className="hidden md:flex" />
                    <Link className="text-3xl font-black" href={"/home"}>
                        BDBashboard
                    </Link>
                </div>

                <HeaderMobileNavMenu />
                <nav className="hidden md:flex gap-4 items-center">
                    {/* <Link className="link link-hover" href={"/about"}>
                        About
                    </Link> */}
                    <Link className="link link-hover" href={"/login"}>
                        Sign In
                    </Link>
                    <Link className="btn btn-primary" href={"/signup"}>
                        Get Started
                    </Link>
                </nav>
            </header>

            <section className="flex flex-col items-center w-full min-h-screen px-4 py-16 font-sans text-base-content bg-linear-30 from-white to-primary-content">
                <h1 className="text-4xl md:text-6xl font-black text-center">
                    How big is
                    <br className="md:hidden" /> today's{" "}
                    <br className="md:hidden" />
                    <span className="text-primary">birthday&nbsp;bash?</span>
                </h1>

                <h2 className="mt-6 text-lg md:max-w-xl text-base-content/50 text-center">
                    BDBashboard lets you take a look at how many people are
                    celebrating their birthdays across the year, all in one
                    place.
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

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] w-full md:max-w-6xl mt-24 mb-16 gap-8">
                    <div className="flex flex-col col-span-full items-center gap-4">
                        <h3 className="text-3xl w-min md:w-max text-center font-bold">
                            Crafted for Celebration
                        </h3>
                        <h4 className="text-center text-base-content/50">
                            Experience a dashboard that prioritizes joy and
                            social connection over simple data entry
                        </h4>
                    </div>

                    <Card
                        key={"Calendar-centric focus"}
                        icon={
                            <IconContainer className="bg-primary-content text-primary">
                                <CalendarDays />
                            </IconContainer>
                        }
                        title="Calendar-centric focus"
                        description="A simple and intuitive calendar interface that visualizes everyone's key moments across months and seasons"
                    />

                    <Card
                        key={"Numeric birthday counts"}
                        icon={
                            <IconContainer className="bg-secondary-content text-secondary">
                                <Tally5 />
                            </IconContainer>
                        }
                        title="Numeric birthday counts"
                        description="Instantly see days with active celebrations with our badge indicators."
                    />

                    <Card
                        key={"Month/Year toggling"}
                        icon={
                            <IconContainer className="bg-primary-content text-primary">
                                <CalendarSync />
                            </IconContainer>
                        }
                        title="Month/Year toggling"
                        description="Seamless glide from daily to montly. Toggle between granular daily birthdays and birds-eye monthly celebrations with one click."
                    />

                    <Card
                        key={"Complete anonymity"}
                        icon={
                            <IconContainer className="bg-secondary-content text-secondary">
                                <HatGlasses />
                            </IconContainer>
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
        </>
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

function HeaderMobileNavMenu(): ReactNode {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsCollapsed(true);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center md:hidden" ref={dropdownRef}>
            <button
                popoverTarget="header-nav-dropdown"
                className="md:hidden text-primary active:scale-95 active:rotate-45 transition-transform"
                aria-label="Show navigation menu"
                style={{ anchorName: "--header-nav-dropdown-anchor" }}
                onClick={() => {
                    setIsCollapsed(!isCollapsed);
                }}
            >
                {isCollapsed ? <MenuIcon size={32} /> : <XIcon size={32} />}
            </button>

            <ul
                className="dropdown menu w-screen mt-2 md:rounded-box bg-base-100 shadow-md text-xl font-bold"
                popover="auto"
                id="header-nav-dropdown"
                style={{ positionAnchor: "--header-nav-dropdown-anchor" }}
            >
                <li>
                    <Link className="text-base-content" href={"/login"}>
                        Sign In
                    </Link>
                </li>
                <li>
                    <Link className="text-base-content" href={"/signup"}>
                        Get Started
                    </Link>
                </li>

                {/* <li>
                        <Link className="text-base-content" href={"/about"}>
                            About
                        </Link>
                    </li> */}
            </ul>
        </nav>
    );
}
