"use client";

import Button from "@/app/_components/Button";
import { MONTHS } from "@/libs/months";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsDown,
    ChevronsUp,
} from "lucide-react";
import { ReactNode } from "react";
import CalendarProvider, { useCalendarContext } from "../context";
import { CalendarMonthGrid } from "./CalendayMonthGrid";
import CalendarYearGrid from "./CalendarYearGrid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    const { state, dispatch, data } = useCalendarContext();

    return (
        <header className="flex h-20 items-end mb-4">
            <div className="flex flex-col grow">
                <HeaderDate />
                <HeaderCounter />
            </div>

            <div className="flex flex-col h-full w-24 md:w-48 justify-between">
                <CalendarUpButton />
                <ViewTypeToggle />

                {state.viewType === "year" ? null : <CalendarNavigation />}
            </div>
        </header>
    );
}

function CalendarNavigation(): ReactNode {
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

function CalendarUpButton(): ReactNode {
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

function HeaderDate(): ReactNode {
    const { state, data } = useCalendarContext();

    const monthName =
        data?.birthdates[state.month].name || MONTHS[state.month - 1];

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
                    <span>{monthName}</span>
                </h3>
            )}
        </>
    );
}

function HeaderCounter(): ReactNode {
    const { state, data } = useCalendarContext();
    const count = data?.total || 0;
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

function Body(): ReactNode {
    const { state } = useCalendarContext();

    return (
        <section className="bg-base-100/30 rounded-2xl p-4 h-120">
            {state.viewType === "month" ? (
                <CalendarMonthGrid />
            ) : (
                <CalendarYearGrid />
            )}
        </section>
    );
}
