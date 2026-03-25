import { CalendarBirthdates } from "@/app/(app)/home/context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useCalendarBirthdays(
    month?: number
) {
    const client = useQueryClient()

    useEffect(() => {
        if(!month) return

        const prevMonth = month < 2 ? 12 : month - 1
        const nextMonth = month > 11 ? 1 : month + 1

        client.prefetchQuery({
            queryKey: ['birthdays', 'count', prevMonth],
            queryFn: async (): Promise<{ total: number, birthdates: Record<number, CalendarBirthdates> }> => {
                const res = await fetch(`api/user/birthday/summary?month=${prevMonth}`)
                const json = await res.json()

                if(!res.ok) {
                    throw new Error(json.message)
                }

                return json
            }
        })

        client.prefetchQuery({
            queryKey: ['birthdays', 'count', nextMonth],
            queryFn: async (): Promise<{ total: number, birthdates: Record<number, CalendarBirthdates> }> => {
                const res = await fetch(`api/user/birthday/summary?month=${nextMonth}`)
                const json = await res.json()

                if(!res.ok) {
                    throw new Error(json.message)
                }

                return json
            }
        })
    }, [month])

    return useQuery({
        queryKey: ['birthday', 'count', month ?? new Date().getUTCFullYear()],
        queryFn: async (): Promise<{ total: number, birthdates: Record<number, CalendarBirthdates> }> => {
            const res = await fetch(`api/user/birthday/summary${month && `?month=${month}`}`)
            const json = await res.json()

            if(!res.ok) {
                throw new Error(json.message)
            }

            return json
        }
    })
}   