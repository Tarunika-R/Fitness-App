import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// One consistent color per sport across the app.
const SPORT_COLORS = {
  running: '#F2B705',
  walking: '#8CA3B8',
  cycling: '#4FA3D1',
  gym: '#E4572E',
  swimming: '#3FB68B',
  daily_steps: '#B57EDC',
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
            <Cell key={entry.sport} fill={SPORT_COLORS[entry.sport] || '#8CA3B8'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#1E4364',
            border: '1px solid #2A5680',
            borderRadius: '8px',
            color: '#F4F6F8',
          }}
          formatter={(value) => [`${value} pts`, '']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ fontSize: '12px', color: '#8CA3B8' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
