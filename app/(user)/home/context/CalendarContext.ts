import { createContext, Dispatch, useContext } from "react";

export const VIEW_TYPES = ['year', 'month'] as const
export type ViewType = typeof VIEW_TYPES[number] 

export interface CalendarMonthDetails {
    name: string
    total: number
    counts: Record<number, number>
}

export interface CalendarState {
    viewType: ViewType,
    month: number,
    year: number,
    total: number
    details: Record<number, CalendarMonthDetails>
}

export type CalendarAction =
    | { type: 'CHANGE_VIEW_TYPE', viewType: ViewType, month?: number }
    | { type: 'CHANGE_TO_MONTH', month: number }

export const CalendarContext = createContext<{state: CalendarState, dispatch: Dispatch<CalendarAction>} | null>(null)

export function useCalendarContext() {
    const cx = useContext(CalendarContext)
    if(!cx) throw new Error("CalendarContext must be within a CalendarContextProvider")
    return cx
}

