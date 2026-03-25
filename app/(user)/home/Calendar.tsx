'use client'

import Button from "@/app/components/Button"
import Spacer from "@/app/components/Spacer"
import { MONTHS } from "@/libs/months"
import { ChevronLeft, ChevronRight, ChevronsUp } from "lucide-react"
import { ReactNode } from "react"
import { CalendarContext, CalendarState, useCalendarContext, VIEW_TYPES, ViewType } from "./context/CalendarContext"
import { CalendarBodyMonth } from "./CalendayBodyMonth"
import CalendarBodyYear from "./CalendarBodyYear"

export default function Calendar(): ReactNode {
    return (
        <section className="card bg-base-100 shadow-md w-full md:w-2xl h-96 md:h-128 overflow-hidden">
            <CalendarHeader/>
            <CalendarBody/>
        </section>
    )
}

function CalendarHeader(): ReactNode {
    const { state, dispatch } = useCalendarContext()

    const monthName = state.details[state.month].name.toUpperCase()
    const prevMonth = state.month - 1 < 0 ? 11 : state.month - 1;
    const nextMonth = state.month + 1 > 11 ? 0 : state.month + 1;

    const handleMoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = Number(e.currentTarget.value)

        if(Number.isNaN(value) || value > 11 || value < 0) {
            console.log("Invalid valid value for month")
            return;
        }

        dispatch({ type: "CHANGE_TO_MONTH", month: value })
    }

    return (
        <div className="flex items-center h-1/6 bg-primary text-primary-content overflow-hidden">
            <CalendarUpButton/>

            <div className={`flex flex-col px-2`}>
                {/* Month and year */}
                <h3 className="text-sm md:text-2xl w-[14ch] text-start font-extrabold">
                    { state.viewType !== 'year' && monthName } { state.year }
                </h3>

                {/* Monthy birthday counter */}
                <CalendarHeaderCounter/>
            </div>

            <Spacer/>

            <Button className={`h-full rounded-none! btn-outline border-0 ${state.viewType !== 'month' && "hidden"}`}
                aria-label={`Move to ${MONTHS[prevMonth]}`}
                value={ prevMonth }
                onClick={handleMoveClick}>
                <ChevronLeft/>
            </Button>

            <Button className={`h-full rounded-none! btn-outline border-0 border-l ${state.viewType !== 'month' && "hidden"}`}
                aria-label={`Move to ${MONTHS[nextMonth]}`}
                value={ nextMonth }
                onClick={handleMoveClick}>
                <ChevronRight/>
            </Button>
        </div>
    )
}

function CalendarUpButton(): ReactNode {
    const { state, dispatch } = useCalendarContext();

    const handleUpClick = () => {
        console.log("asdad")
        dispatch({ type: 'CHANGE_VIEW_TYPE', viewType: 'year'})
    }

    return (
        <Button className={`h-full rounded-none! max-md:p-2 btn-outline border-0 border-r flex flex-col
                ${state.viewType === 'year' && "invisible"}`}
            aria-label="Return to year"
            onClick={handleUpClick}>
            <ChevronsUp/>
        </Button>
    )
}

function CalendarHeaderCounter(): ReactNode {
    const { state } = useCalendarContext()
    let message = ""

    if(state.viewType === 'year') {
        message = `${state.total} people are having birthdays this year`
    }

    if(state.viewType === 'month') {
        message = `${state.details[state.month].total} are having birthdays this month`
    }

    return (
        <span className="text-xs leading-4 text-primary-content">
            { message }
        </span>
    )
}

function CalendarBody(): ReactNode {
    const { state } = useCalendarContext()

    switch(state.viewType) {
        case 'year':
            return (
                <CalendarBodyYear/>
            )

        default:
            return (
                <CalendarBodyMonth/>
            )
    }
}

