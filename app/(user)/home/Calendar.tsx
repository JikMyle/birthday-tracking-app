export default function Calendar(): React.ReactNode {
    return (
        <div className="flex flex-col border-2 border-black w-full md:w-2xl h-96 md:h-128 rounded-2xl overflow-hidden">
            {/* Calendar Header */}
            <div className="flex justify-between items-center h-1/6 border-b-2 border-black">
                <button className="flex md:hidden btn h-full">lBtn</button>
                <div className="grow flex flex-col gap-1 justify-center items-center text-base-content">

                    <div className="flex justify-center items-center gap-2">

                        <button className="btn btn-xs hidden md:block">lBtn</button>
                        <div className="flex flex-col justify-center items-center">

                            {/* Month display is a button to return to year view */}
                            <button className="btn btn-neutral btn-outline">
                                <h3 className="text-2xl w-[9ch] text-center">Month</h3>
                            </button>
                        </div>
                        <button className="btn btn-xs hidden md:block">rBtn</button>

                    </div>

                    <span className="text-xs leading-2 text-base-content/70">????? birthdays</span>
                </div>
                <button className="btn flex md:hidden h-full">rBtn</button>
            </div>

            {/* Calendar Body */}

            {/* Month Calendar */}
            <div className="hidden grid grid-cols-7 grid-rows-5 grow text-base-content">
                <div className="w-full h-full border-white"></div>
                <div className="w-full h-full border-white"></div>
                <div className="w-full h-full border-white"></div>

                {
                    Array.from({ length: 31}).map((x) => CalendarDate())
                    
                }
                
                <div className="w-full h-full border-white"></div>
            </div>

            {/* Year Calendar */}
            <div className="grow grid grid-cols-4 grid-rows-3 text-base-content">
                {
                    CalendarMonths()
                }
            </div>
        </div>
    )
}



function CalendarMonths(): React.ReactNode {
    return (
        <>
            {
                Array.from({length: 12}).map(() =>
                    <div className="border-2 border-white relative w-full h-full p-2 flex justify-center items-center overflow-hidden">
                        <span className="w-full max-sm:text-sm text-center leading-4">Septem&shy;ber</span>
                    </div>
                )
            }
        </>
    )
}

function CalendarDate(): React.ReactNode {
    return (
        <div className="relative w-full h-full border-white border-2 flex flex-col justify-center items-center">
            <span className="text-2xl">1</span>
            <span className="absolute mx-auto bottom-0 leading-4 text-xs text-base-content/70">23</span>
        </div>
    )
}