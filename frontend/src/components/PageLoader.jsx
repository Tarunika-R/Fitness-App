export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-track/85 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-40 h-20">
                    <div className="absolute left-1/2 bottom-5 h-14 w-12 -translate-x-1/2 text-gold animate-runner-bob" aria-hidden="true">
                        <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-current" />
                        <span className="absolute left-1/2 top-3 h-5 w-2.5 -translate-x-1/2 rounded-full bg-current rotate-[18deg]" />
                        <span className="absolute left-1/2 top-3.5 h-4 w-1.5 -translate-x-[5px] rounded-full bg-current origin-top animate-runner-arm-front" />
                        <span className="absolute left-1/2 top-3.5 h-4 w-1.5 -translate-x-[-2px] rounded-full bg-current origin-top animate-runner-arm-back" />
                        <span className="absolute left-1/2 top-7 h-6 w-1.5 -translate-x-[4px] rounded-full bg-current origin-top animate-runner-leg-front" />
                        <span className="absolute left-1/2 top-7 h-6 w-1.5 -translate-x-[-1px] rounded-full bg-current origin-top animate-runner-leg-back" />
                    </div>

                    <div className="absolute bottom-[17px] left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-black/25 blur-[2px] animate-run-shadow" />

                    <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-track-surfaceLight" />

                    <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
                        <div className="flex gap-4 w-[200%] animate-track-scroll">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="h-1 w-6 bg-track-surfaceLight rounded-full flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-chalk-muted text-xs font-semibold tracking-[0.2em]">LOADING</p>
            </div>
        </div>
    )
}
