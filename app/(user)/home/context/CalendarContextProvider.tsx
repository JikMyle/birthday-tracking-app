'use client'

import { ReactNode, useReducer } from "react";
import { CalendarAction, CalendarContext, CalendarMonthDetails, CalendarState } from "./CalendarContext";
import { MONTHS } from "@/libs/months";

const generateInitialState = (): CalendarState => {
    const now = new Date()
    const nowMonth = now.getUTCMonth()

    const details: Record<number, CalendarMonthDetails> = {}
    details[nowMonth] = {
        name: MONTHS[nowMonth],
        total: 0,
        counts: {}
    }

    return {
        viewType: 'month',
        year: now.getUTCFullYear(),
        month: nowMonth,
        total: 0,
        details: details
    }
}

function reducer(
    state: CalendarState, 
    action: CalendarAction
): CalendarState {
    const emptyDetails = (month: number): CalendarMonthDetails => {
        return { name: MONTHS[month], total: 0, counts: {}}
    }

    const generateDetails = (month: number): Record<number, CalendarMonthDetails> => {
        const months = [month - 1, month, month + 1]

        const details = Object.fromEntries(
            months.map(
                (month) => [month, state.details[month] ?? emptyDetails(month)]
            )
        )

        return details
    }

    switch(action.type) {
        case "CHANGE_VIEW_TYPE":
            const details = !action.month ? null :
                generateDetails(action.month)

            return {
                ...state, 
                viewType: action.viewType, 
                month: action.month ?? state.month,
                details: details ?? state.details
            }

        case "CHANGE_TO_MONTH":
            return {
                ...state, 
                month: action.month, 
                details: generateDetails(action.month)
            }

            default:
            return state
    }
}

export default function CalendarContextProvider({
    children
}: { children: ReactNode }
): ReactNode {
    const [ state, dispatch ] = useReducer(reducer, generateInitialState())

    return (
        <CalendarContext.Provider value={{state: state, dispatch: dispatch}}>
            { children }
        </CalendarContext.Provider>
    )
}