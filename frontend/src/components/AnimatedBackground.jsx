import { useEffect, useState } from 'react'

// Renders a handful of large, blurred color blobs fixed behind the whole
// app. They ease toward the cursor position (parallax feel) and also
// idle-float on their own via CSS keyframes, so the page still feels
// alive even before the mouse moves. Respects prefers-reduced-motion.
export default function AnimatedBackground() {
    const [ratio, setRatio] = useState({ x: 0.5, y: 0.5 })
    const [enabled, setEnabled] = useState(true)

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setEnabled(!reduceMotion)
        if (reduceMotion) return

        let frame = null
        const handleMove = (e) => {
            if (frame) return
            frame = requestAnimationFrame(() => {
                setRatio({
                    x: e.clientX / window.innerWidth,
                    y: e.clientY / window.innerHeight,
                })
                frame = null
            })
        }

        window.addEventListener('mousemove', handleMove)
        return () => {
            window.removeEventListener('mousemove', handleMove)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    const parallax = (strength, axis) =>
        enabled ? `${((ratio[axis] - 0.5) * strength).toFixed(1)}px` : '0px'

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-track" />
            <div
                className="absolute w-[34rem] h-[34rem] rounded-full blur-[120px] opacity-40 bg-gold animate-drift transition-transform duration-700 ease-out"
                style={{
                    top: '-8%',
                    left: '2%',
                    transform: `translate(${parallax(70, 'x')}, ${parallax(50, 'y')})`,
                }}
            />
            <div
                className="absolute w-[30rem] h-[30rem] rounded-full blur-[130px] opacity-30 bg-cinder animate-drift-slow transition-transform duration-700 ease-out"
                style={{
                    bottom: '-12%',
                    right: '-4%',
                    transform: `translate(${parallax(-60, 'x')}, ${parallax(-40, 'y')})`,
                }}
            />
            <div
                className="absolute w-[26rem] h-[26rem] rounded-full blur-[110px] opacity-20 bg-track-surfaceLight animate-drift transition-transform duration-700 ease-out"
                style={{
                    top: '38%',
                    left: '42%',
                    transform: `translate(${parallax(40, 'x')}, ${parallax(60, 'y')})`,
                }}
            />
        </div>
    )
}
