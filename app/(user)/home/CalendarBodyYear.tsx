import { MONTHS } from "@/libs/months";
import { ReactNode } from "react";
import { useCalendarContext } from "./context/CalendarContext";
import { CalendarCell } from "./CalendarCell";

export default function CalendarBodyYear(): ReactNode {
    const { state, dispatch } = useCalendarContext()

    const jumpToMonth = (month: number) => {
        dispatch({ type: 'CHANGE_VIEW_TYPE', viewType: 'month', month: month})
    }

    const rows = MONTHS.map((month, index) => {
        const count = state.details[index]?.total ?? 0;

        return (
            <CalendarCell 
                key={index} 
                date={month} 
                count={count}
                label={`Jump to ${month}`}
                onClick={ () => { jumpToMonth(index) } }/>
        )
    })

    return (
        <div className="grid grid-cols-4 grid-rows-3 grow text-base-content">
            { rows }
        </div>
    )
}