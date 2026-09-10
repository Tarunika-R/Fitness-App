import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SPORT_COLORS, SPORT_LABELS, THEME_COLORS } from '../theme.js'

// Custom tooltip: the points value is colored to match the slice being
// hovered, so the number is immediately tied back to that sport's color
// in the donut and legend — rather than every tooltip showing the same
// flat text color regardless of which segment is active.
function BreakdownTooltip({ active, payload }) {
    if (!active || !payload || payload.length === 0) return null
    const entry = payload[0]
    const color = entry.payload.fill

    return (
        <div
            style={{
                background: THEME_COLORS.trackSurface,
                border: `1px solid ${THEME_COLORS.trackSurfaceLight}`,
                borderRadius: '8px',
                padding: '8px 12px',
            }}
        >
            <p style={{ color: THEME_COLORS.chalkMuted, fontSize: 12, marginBottom: 2 }}>
                {entry.name}
            </p>
            <p style={{ color, fontSize: 14, fontWeight: 700 }}>
                {entry.value.toLocaleString()} pts
            </p>
        </div>
    )
}

export default function SportBreakdownChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-chalk-muted text-sm">
                Log a few activities to see your sport breakdown.
            </div>
        )
    }

    const chartData = data.map((d) => ({
        name: SPORT_LABELS[d.sport] || d.sport,
        value: d.total_points,
        sport: d.sport,
        fill: SPORT_COLORS[d.sport] || THEME_COLORS.chalkMuted,
    }))

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                >
                    {chartData.map((entry) => (
                        <Cell key={entry.sport} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip content={<BreakdownTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '12px', color: THEME_COLORS.chalkMuted }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
