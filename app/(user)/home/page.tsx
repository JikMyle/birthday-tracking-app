import Calendar from "./Calendar"

export default function Home() {
    return (
        <div className="flex flex-col items-center">
            <HomeHeading></HomeHeading>

            {/* Calendar */}
            <Calendar></Calendar>
        </div>
    )
}

function HomeHeading(): React.ReactNode {
    return (
        <>
            <h1 className="p-4 w-full md:w-fit pb-2 text-base-content text-center text-2xl md:text-4xl font-bold max-sm:leading-6">
                🎂 How big is today's <span className="font-extrabold text-primary">birthday&nbsp;bash</span>?
            </h1>
            <h2 className="mb-8 md:mb-12 w-3/4 text-sm md:text-base text-base-content font-light text-center">
                Pick a date and see how&nbsp;many&nbsp;are&nbsp;celebrating!
            </h2>
        </>
    )
}