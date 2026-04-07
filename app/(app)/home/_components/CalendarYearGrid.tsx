"use client";

import { MONTHS } from "@/libs/months";
import { ReactNode } from "react";
import { useCalendarContext } from "../context";
import { CalendarCell } from "./CalendarCell";
import useCalendarBirthdays from "@/libs/hooks/useCalendarBirthdays";

export default function CalendarYearGrid(): ReactNode {
    const { dispatch } = useCalendarContext();
    const { data, isLoading } = useCalendarBirthdays();

    if (isLoading || !data) {
        return <Skeleton />;
    }

    const jumpToMonth = (month: number) => {
        dispatch({ type: "JUMP_TO_MONTH", month: month });
    };

    const rows = MONTHS.map((month, index) => {
        const count = data?.birthdates[index + 1]
            ? data?.birthdates[index + 1].total
            : 0;

        return (
            <CalendarCell
                key={index}
                date={month.slice(0, 3)}
                today={new Date().getUTCMonth() === index}
                count={count}
                label={`Jump to ${month}`}
                onClick={() => {
                    jumpToMonth(index + 1);
                }}
            />
        );
    });

    return (
        <div className="grid grid-cols-4 grid-rows-3 grow h-full">{rows}</div>
    );
}
function Skeleton(): ReactNode {
    return (
        <div className="grid grid-cols-4 grid-rows-3 grow h-full items-center gap-2">
            {Array.from({ length: 12 }).map((item, index) => (
                <div className="flex p-1 md:p-2 h-full w-full" key={index}>
                    <div className="skeleton grow"></div>
                </div>
            ))}
        </div>
    );
}
