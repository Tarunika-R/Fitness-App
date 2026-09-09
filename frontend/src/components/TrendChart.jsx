import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-chalk-muted text-sm">
        No activity logged yet — your trend will appear here.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2B705" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#F2B705" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2A5680" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#8CA3B8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#8CA3B8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#1E4364',
            border: '1px solid #2A5680',
            borderRadius: '8px',
            color: '#F4F6F8',
          }}
          labelStyle={{ color: '#8CA3B8' }}
        />
        <Area
          type="monotone"
          dataKey="points"
          stroke="#F2B705"
          strokeWidth={2}
          fill="url(#goldFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
