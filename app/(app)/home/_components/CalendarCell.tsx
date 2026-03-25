import { ReactNode } from "react";

interface CalendarCellProps {
    date?: number | string
    count?: number
    label?: string
    onClick?: () => void
}
export function CalendarCell({
    date, 
    count,
    label,
    onClick
}: CalendarCellProps
): ReactNode {
    if (!date) {
        return (
            <CalendarEmptyCell />
        )
    }


    return (
        <button className={`group relative btn btn-outline btn-primary border border-neutral-content rounded-none w-full h-full`}
            aria-label={label}
            onClick={onClick}>
                
            <span className="text-xl md:text-2xl">{date}</span>

            {!count ? null :
                <span className={`absolute mx-auto bottom-0 right-1 leading-4 text-xs font-medium text-inherit`}>
                    🎉 {count}
                </span>}
        </button>
    )
}
function CalendarEmptyCell(): ReactNode {
    return (
        <div className="border border-neutral-content w-full h-full"></div>
    )
}
