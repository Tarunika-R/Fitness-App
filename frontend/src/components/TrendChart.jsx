import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { THEME_COLORS, CHART_TOOLTIP_STYLE } from '../theme.js'

// Beyond this many daily data points, plotting every single day gets
// cluttered (overlapping x-axis labels, a jagged line that's hard to read
// trends from). Group into weekly buckets instead once there's more than
// two weeks of history, and into monthly buckets once there's more than
// a few months — same idea as how most fitness apps zoom out their trend
// view as more history accumulates.
const WEEKLY_THRESHOLD_DAYS = 14
const MONTHLY_THRESHOLD_DAYS = 60

function startOfWeek(date) {
    const d = new Date(date)
    const day = d.getDay() // 0 = Sunday
    const diff = day === 0 ? -6 : 1 - day // shift to Monday
    d.setDate(d.getDate() + diff)
    return d
}

function groupByWeek(data) {
    const buckets = new Map()
    for (const { date, points } of data) {
        const weekStart = startOfWeek(date)
        const key = weekStart.toISOString().slice(0, 10)
        buckets.set(key, (buckets.get(key) || 0) + points)
    }
    return [...buckets.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([weekStart, points]) => ({
            date: new Date(weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            points,
        }))
}

function groupByMonth(data) {
    const buckets = new Map()
    for (const { date, points } of data) {
        const d = new Date(date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        buckets.set(key, (buckets.get(key) || 0) + points)
    }
    return [...buckets.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([monthKey, points]) => {
            const [year, month] = monthKey.split('-')
            const label = new Date(Number(year), Number(month) - 1, 1)
                .toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
            return { date: label, points }
        })
}

function prepareChartData(data) {
    const dayCount = data.length
    if (dayCount <= WEEKLY_THRESHOLD_DAYS) {
        return { chartData: data, granularity: 'day' }
    }
    if (dayCount <= MONTHLY_THRESHOLD_DAYS) {
        return { chartData: groupByWeek(data), granularity: 'week' }
    }
    return { chartData: groupByMonth(data), granularity: 'month' }
}

const GRANULARITY_LABEL = {
    day: null, // no caption needed for the default, ungrouped view
    week: 'Grouped by week — showing totals per week',
    month: 'Grouped by month — showing totals per month',
}

export default function TrendChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-chalk-muted text-sm">
                No activity logged yet — your trend will appear here.
            </div>
        )
    }

    const { chartData, granularity } = prepareChartData(data)
    const caption = GRANULARITY_LABEL[granularity]

    return (
        <div>
            <ResponsiveContainer width="100%" height={caption ? 236 : 260}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={THEME_COLORS.gold} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={THEME_COLORS.gold} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={THEME_COLORS.trackSurfaceLight} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke={THEME_COLORS.chalkMuted}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis stroke={THEME_COLORS.chalkMuted} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={CHART_TOOLTIP_STYLE}
                        labelStyle={{ color: THEME_COLORS.chalkMuted }}
                        itemStyle={{ color: THEME_COLORS.gold, fontWeight: 700 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="points"
                        stroke={THEME_COLORS.gold}
                        strokeWidth={2}
                        fill="url(#goldFill)"
                    />
                </AreaChart>
            </ResponsiveContainer>
            {caption && (
                <p className="text-chalk-muted text-xs text-center mt-1">{caption}</p>
            )}
        </div>
    )
}
