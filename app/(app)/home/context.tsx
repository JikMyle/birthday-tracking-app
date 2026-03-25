'use client'

import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import useCalendarBirthdays from "@/libs/hooks/useCalendarBirthdays";

export const VIEW_TYPES = ['year', 'month'] as const;
export type ViewType = (typeof VIEW_TYPES)[number];

export interface CalendarBirthdates {
    name: string;
    total: number;
    days: Record<number, number>;
}

export interface CalendarUiState {
    viewType: ViewType;
    month: number;
    year: number;
}

export type CalendarAction = { type: 'ZOOM_OUT_TO_YEAR'; } |
{ type: 'JUMP_TO_MONTH'; month: number; } |
{ type: 'PREV_MONTH'; } |
{ type: 'NEXT_MONTH'; };

function reducer(
    state: CalendarUiState,
    action: CalendarAction
): CalendarUiState {

    switch (action.type) {
        case 'ZOOM_OUT_TO_YEAR':
            return { ...state, viewType: 'year' };

        case 'JUMP_TO_MONTH':
            if (action.month > 12 || action.month < 1) return state;
            return { ...state, viewType: 'month', month: action.month };

        case 'PREV_MONTH':
            const prev = state.month < 2 ? 12 : state.month - 1;
            return { ...state, month: prev };

        case 'NEXT_MONTH':
            const next = state.month > 11 ? 1 : state.month + 1;
            return { ...state, month: next };

        default:
            return state;
    }
}

type CalendarContextType = {
    state: CalendarUiState,
    dispatch: Dispatch<CalendarAction>
    data: { total: number, birthdates: Record<number, CalendarBirthdates> } | undefined,
    error: Error | null
} | null

export const CalendarContext = createContext<CalendarContextType>(null)

export function useCalendarContext() {
    const cx = useContext(CalendarContext)
    if(!cx) throw new Error("CalendarContext must be within a CalendarContextProvider")
    return cx
}

export default function CalendarProvider({
    children
}: { children: ReactNode; }
): ReactNode {
    const [state, dispatch] = useReducer(reducer, {
        viewType: 'month',
        month: new Date().getUTCMonth() + 1,
        year: new Date().getUTCFullYear()
    });

    const { data, error } = useCalendarBirthdays(state.month)

    return (
        <CalendarContext.Provider value={{ state: state, dispatch: dispatch, data: data, error: error }}>
            {children}
        </CalendarContext.Provider>
    );
}


