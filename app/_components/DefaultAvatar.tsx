"use client";
export function DefaultAvatar({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="currentColor"
            stroke="currentColor"
            color="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0"
                fill="currentColor"
            />
        </svg>
    );
}
