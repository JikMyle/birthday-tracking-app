'use client'

import Button from "@/app/_components/Button"
import Spacer from "@/app/_components/Spacer"
import { MONTHS } from "@/libs/months"
import { ChevronLeft, ChevronRight, ChevronsUp } from "lucide-react"
import { ReactNode } from "react"
import CalendarProvider, { useCalendarContext } from "../context"
import { CalendarMonthGrid } from "./CalendayMonthGrid"
import CalendarYearGrid from "./CalendarYearGrid"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const client = new QueryClient()

export default function Calendar(): ReactNode {
    return (
        <QueryClientProvider client={client}>
            <CalendarProvider>
                <section className="card bg-base-100 shadow-md w-full md:w-2xl h-96 md:h-128 overflow-hidden">
                    <CalendarHeader/>
                    <CalendarBody/>
                </section>
            </CalendarProvider>
        </QueryClientProvider>
    )
}

function CalendarHeader(): ReactNode {
    const { state, dispatch, data } = useCalendarContext()

    const monthName = data?.birthdates[state.month].name || MONTHS[state.month - 1]
    const prevMonth = state.month - 1 < 0 ? 11 : state.month - 1;
    const nextMonth = state.month + 1 > 11 ? 0 : state.month + 1;

    const handleToPrevMonth = () => {
        dispatch({ type: 'PREV_MONTH' })
    }

    const handleToNextMonth = () => {
        dispatch({ type: 'NEXT_MONTH' })
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
                onClick={handleToPrevMonth}>
                <ChevronLeft/>
            </Button>

            <Button className={`h-full rounded-none! btn-outline border-0 border-l ${state.viewType !== 'month' && "hidden"}`}
                aria-label={`Move to ${MONTHS[nextMonth]}`}
                onClick={handleToNextMonth}>
                <ChevronRight/>
            </Button>
        </div>
    )
}

function CalendarUpButton(): ReactNode {
    const { state, dispatch } = useCalendarContext();

    const handleUpClick = () => {
        console.log("asdad")
        dispatch({ type: 'ZOOM_OUT_TO_YEAR'})
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
    const { state, data } = useCalendarContext()
    const count = data?.total || 0
    let message = ""

    if(state.viewType === 'year') {
        message = `${count} people are having birthdays this year`
    }

    if(state.viewType === 'month') {
        message = `${count} are having birthdays this month`
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
                <CalendarYearGrid/>
            )

        default:
            return (
                <CalendarMonthGrid/>
            )
    }
}

