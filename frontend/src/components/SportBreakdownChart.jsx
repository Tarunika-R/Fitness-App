import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// One consistent color per sport across the app.
const SPORT_COLORS = {
    running: '#00F5D4',
    walking: '#9C93C7',
    cycling: '#4FA3FF',
    gym: '#FF3D81',
    swimming: '#3FE0B6',
    daily_steps: '#B57EFF',
}

const SPORT_LABELS = {
    running: 'Running',
    walking: 'Walking',
    cycling: 'Cycling',
    gym: 'Gym',
    swimming: 'Swimming',
    daily_steps: 'Daily Steps',
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
                        <Cell key={entry.sport} fill={SPORT_COLORS[entry.sport] || '#9C93C7'} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: '#181530',
                        border: '1px solid #282149',
                        borderRadius: '8px',
                        color: '#F2EFFB',
                    }}
                    formatter={(value) => [`${value} pts`, '']}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '12px', color: '#9C93C7' }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
