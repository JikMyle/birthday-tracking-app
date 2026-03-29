import { ReactNode } from "react";

interface CalendarCellProps {
    date?: number | string;
    count?: number;
    today?: boolean;
    label?: string;
    onClick?: () => void;
}
export function CalendarCell({
    date,
    count,
    today = false,
    label,
    onClick,
}: CalendarCellProps): ReactNode {
    if (!date) {
        return <CalendarEmptyCell />;
    }

    return (
        <button
            className={`group relative btn ${count ? "btn-primary" : "btn-neutral"} ${today ? "btn-outline border-2" : "btn-ghost"} rounded-full md:rounded-2xl w-full h-full`}
            aria-label={label}
            onClick={onClick}
        >
            <span className="text-xl md:text-2xl">{date}</span>
            {!count ? null : (
                <span className="absolute bottom-0 text-xs bg-secondary flex justify-center items-center w-6 h-6 rounded-full text-white overflow-hidden">
                    {Math.min(count, 99)}
                    {count && count > 99 && "+"}
                </span>
            )}
        </button>
    );
}

function CalendarEmptyCell(): ReactNode {
    return <div></div>;
}
