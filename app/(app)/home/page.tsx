import Calendar from "./_components/Calendar";

export default function Home() {
    return (
        <div className="flex flex-col md:items-center p-4">
            <HomeHeading />
            <Calendar />
        </div>
    );
}

function HomeHeading(): React.ReactNode {
    return (
        <>
            <h1 className="md:w-fit text-base-content text-3xl md:text-4xl font-bold max-sm:leading-8 mb-2">
                How big is today's{" "}
                <span className="font-extrabold text-primary">
                    birthday&nbsp;bash 🎂
                </span>
                ?
            </h1>
            <h2 className="mb-6 md:mb-12 w-3/4 text-sm md:text-base text-base-content md:text-center font-light">
                Pick a date and see how&nbsp;many&nbsp;are&nbsp;celebrating!
            </h2>
        </>
    );
}
