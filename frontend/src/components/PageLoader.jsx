export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-track/80 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-track-surfaceLight border-t-gold animate-spin" />
                <p className="text-chalk-muted text-xs font-semibold tracking-[0.2em]">LOADING</p>
            </div>
        </div>
    )
}
