"use client";

import { ReactNode } from "react";
import { CalendarCell } from "./CalendarCell";
import { useCalendarContext } from "../context";
import { MONTHS } from "@/libs/months";

export function CalendarMonthGrid(): ReactNode {
    const { state, dispatch, data } = useCalendarContext();

    // Use UTC-based date math to avoid server-client date mismatch
    const firstDay = new Date(
        Date.UTC(state.year, state.month - 1, 1),
    ).getUTCDay();

    const lastDay = new Date(Date.UTC(state.year, state.month, 0)).getUTCDate();

    const counts = data?.birthdates[state.month].days || {};

    const cells: ReactNode[] = [];
    for (let index = -1 * firstDay + 1; index < 36 - firstDay; index++) {
        if (index < 1 || index > lastDay) {
            cells.push(<CalendarCell key={index} />);
            continue;
        }

        if (!counts[index]) {
            cells.push(<CalendarCell key={index} date={index} />);
            continue;
        }

        const now = new Date();
        const today =
            now.getUTCDate() === index && now.getUTCMonth() === state.month - 1;

        cells.push(
            <CalendarCell
                key={index}
                date={index}
                today={today}
                count={counts[index + 1]}
                label={`${MONTHS[state.month - 1]} ${index}`}
            />,
        );
    }

    return (
        <div className="grid grid-cols-7 grid-rows-[2rem_repeat(5,1fr)] h-full items-center gap-2">
            <Days />
            {cells}
        </div>
    );
}
function Days(): ReactNode {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return (
        <>
            {days.map((day, index) => {
                return (
                    <div
                        className={`flex justify-center items-center text-base-content/50 text-center
                        ${index !== 0 ? "border-l-0" : ""}`}
                        key={index}
                    >
                        <span className="font-semibold tracking-widest text-xs">
                            {day}
                        </span>
                    </div>
                );
            })}
        </>
    );
}
