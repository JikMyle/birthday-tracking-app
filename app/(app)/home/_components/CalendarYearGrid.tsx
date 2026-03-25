import { MONTHS } from "@/libs/months";
import { ReactNode } from "react";
import { useCalendarContext } from "../context";
import { CalendarCell } from "./CalendarCell";

export default function CalendarYearGrid(): ReactNode { 
    const { state, dispatch, data } = useCalendarContext()

    const jumpToMonth = (month: number) => {
        dispatch({ type: 'JUMP_TO_MONTH', month: month})
    }

    const rows = MONTHS.map((month, index) => {
        const count = data?.total ?? 0;

        return (
            <CalendarCell 
                key={index} 
                date={month} 
                count={count}
                label={`Jump to ${month}`}
                onClick={ () => { jumpToMonth(index + 1) } }/>
        )
    })

    return (
        <div className="grid grid-cols-4 grid-rows-3 grow text-base-content">
            { rows }
        </div>
    )
}