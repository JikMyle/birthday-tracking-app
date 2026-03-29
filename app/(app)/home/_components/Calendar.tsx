"use client";

import Button from "@/app/_components/Button";
import { MONTHS } from "@/libs/months";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsDown,
    ChevronsUp,
} from "lucide-react";
import { ReactNode, Suspense } from "react";
import CalendarProvider, { useCalendarContext } from "../context";
import { CalendarMonthGrid } from "./CalendayMonthGrid";
import CalendarYearGrid from "./CalendarYearGrid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCalendarBirthdays from "@/libs/hooks/useCalendarBirthdays";

const client = new QueryClient();

export default function Calendar(): ReactNode {
    return (
        <QueryClientProvider client={client}>
            <CalendarProvider>
                <section className="w-full md:w-3xl overflow-hidden">
                    <Header />
                    <Body />
                </section>
            </CalendarProvider>
        </QueryClientProvider>
    );
}

function Header(): ReactNode {
    const { state } = useCalendarContext();

    return (
        <header className="flex h-20 items-end mb-4">
            <Suspense fallback={<HeaderTextSkeleton />}>
                <HeaderText />
            </Suspense>

            <div className="flex flex-col h-full w-24 md:w-48 justify-between">
                <UpButton />
                <ViewTypeToggle />

                {state.viewType === "year" ? null : <Navigation />}
            </div>
        </header>
    );
}

function HeaderTextSkeleton(): ReactNode {
    return (
        <div className="flex flex-col grow h-full">
            <div className="h-14 md:w-md skeleton">A</div>
            <div className="text-xs md:w-xs skeleton mt-1">A</div>
        </div>
    );
}

function HeaderText(): ReactNode {
    const { state } = useCalendarContext();
    const { data, error } =
        state.viewType === "year"
            ? useCalendarBirthdays()
            : useCalendarBirthdays(state.month);

    const count =
        state.viewType === "year"
            ? data.total
            : data.birthdates[state.month].total;

    return (
        <div className="flex flex-col grow">
            <HeaderDate
                month={
                    data.birthdates[state.month].name || MONTHS[state.month - 1]
                }
            />
            <HeaderCounter count={count} />
        </div>
    );
}

function HeaderDate({ month }: { month: string }): ReactNode {
    const { state } = useCalendarContext();

    return (
        <>
            {state.viewType === "year" ? (
                <h3 className="text-6xl w-[4ch] overflow-hidden text-start font-extrabold text-base-content">
                    {state.year}{" "}
                </h3>
            ) : (
                <h3 className="text-3xl md:text-6xl w-[9ch] md:w-[12ch] text-start font-extrabold text-base-content">
                    <span
                        className={`block h-full md:inline max-md:leading-6 text-base-content/50`}
                    >
                        {state.year}{" "}
                    </span>
                    <span>{month}</span>
                </h3>
            )}
        </>
    );
}

function HeaderCounter({ count }: { count: number }): ReactNode {
    const { state } = useCalendarContext();
    let message = "";

    if (count > 1) {
        message = `${count} people have birthdays this `;
    }

    if (count === 1) {
        message = `1 person has a birthday this `;
    }

    if (count === 0) {
        message = "No birthdays this";
    }

    return (
        <h4 className="text-xs text-secondary tracking-wide font-semibold overflow-hidden whitespace-nowrap">
            {message + state.viewType}
        </h4>
    );
}

function Navigation(): ReactNode {
    const { dispatch } = useCalendarContext();

    const handleToPrevMonth = () => {
        dispatch({ type: "PREV_MONTH" });
    };

    const handleToNextMonth = () => {
        dispatch({ type: "NEXT_MONTH" });
    };

    const handleToToday = () => {
        dispatch({
            type: "JUMP_TO_MONTH",
            month: new Date().getUTCMonth() + 1,
        });
    };

    return (
        <div className="flex w-full justify-between gap-2">
            <Button
                className="px-2 btn-primary btn-soft btn-sm md:btn-md"
                onClick={handleToPrevMonth}
                aria-label="Move to previous month"
            >
                <ChevronLeft size={24} />
            </Button>

            <Button
                className="hidden md:flex btn-primary btn-soft btn-sm md:btn-md"
                onClick={handleToToday}
            >
                Today
            </Button>

            <Button
                className="px-2 btn-primary btn-soft btn-sm md:btn-md"
                onClick={handleToNextMonth}
                aria-label="Move to next month"
            >
                <ChevronRight size={24} />
            </Button>
        </div>
    );
}

function UpButton(): ReactNode {
    const { state, dispatch } = useCalendarContext();

    const handleUpClick = () => {
        dispatch({ type: "ZOOM_OUT_TO_YEAR" });
    };

    const handleJumpToMonth = () => {
        dispatch({ type: "JUMP_TO_MONTH", month: state.month });
    };

    return (
        <Button
            className={`md:hidden btn-primary btn-soft btn-sm`}
            onClick={
                state.viewType === "month" ? handleUpClick : handleJumpToMonth
            }
        >
            {state.viewType === "month" ? (
                <>
                    <ChevronsUp size={16} />
                    Year
                </>
            ) : (
                <>
                    <ChevronsDown size={16} />
                    Month
                </>
            )}
        </Button>
    );
}

function ViewTypeToggle(): ReactNode {
    const { state, dispatch } = useCalendarContext();

    const handleSwitchToYearClick = () => {
        if (state.viewType === "year") return;
        dispatch({ type: "ZOOM_OUT_TO_YEAR" });
    };

    const handleSwitchToMonthClick = () => {
        if (state.viewType === "month") return;
        dispatch({ type: "JUMP_TO_MONTH", month: state.month });
    };

    return (
        <div className="hidden md:flex join w-full">
            <Button
                className={`grow btn-primary btn-sm join-item ${state.viewType !== "month" && "btn-soft"}`}
                onClick={handleSwitchToMonthClick}
            >
                Month
            </Button>
            <Button
                className={`grow btn-primary btn-sm join-item ${state.viewType !== "year" && "btn-soft"}`}
                onClick={handleSwitchToYearClick}
            >
                Year
            </Button>
        </div>
    );
}

function Body(): ReactNode {
    const { state } = useCalendarContext();

    return (
        <section className="bg-base-100/30 rounded-2xl p-4 h-120">
            {state.viewType === "month" ? (
                <Suspense fallback={<BodyMonthGridSkeleton />}>
                    <CalendarMonthGrid />
                </Suspense>
            ) : (
                <Suspense fallback={<BodyYearGridSkeleton />}>
                    <CalendarYearGrid />
                </Suspense>
            )}
        </section>
    );
}

function BodyMonthGridSkeleton(): ReactNode {
    return (
        <div className="grid grid-cols-7 grid-rows-[2rem_repeat(5,1fr)] h-full items-center gap-2">
            {Array.from({ length: 42 }).map((item, index) => (
                <div className="flex p-2 h-full w-full" key={index}>
                    <div className="skeleton grow"></div>
                </div>
            ))}
        </div>
    );
}

function BodyYearGridSkeleton(): ReactNode {
    return (
        <div className="grid grid-cols-4 grid-rows-3 grow h-full items-center gap-2">
            {Array.from({ length: 12 }).map((item, index) => (
                <div className="flex p-2 h-full w-full" key={index}>
                    <div className="skeleton grow"></div>
                </div>
            ))}
        </div>
    );
}
