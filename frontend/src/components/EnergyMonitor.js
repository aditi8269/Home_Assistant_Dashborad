import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const EnergyMonitor = () => {
  const energyData = useSelector(state => state.energy.data);
  const loading = useSelector(state => state.energy.loading);

  const totalDaily = energyData.reduce((acc, room) => acc + room.daily_usage, 0);
  const totalWeekly = energyData.reduce((acc, room) => acc + room.weekly_usage, 0);

  const chartData = energyData.map((room, index) => ({
    name: room.room_name,
    usage: room.daily_usage,
    index,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 shadow-lg">
          <p className="font-medium text-sm">{payload[0].payload.name}</p>
          <p className="text-xs text-statusActive">
            {payload[0].value.toFixed(1)} kWh
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="glass-panel p-6">Loading energy data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
      data-testid="energy-monitor"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-statusActive/20">
          <Zap className="w-6 h-6 text-statusActive" />
        </div>
        <div>
          <h2 className="text-xl font-manrope font-bold">Energy Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Total: {totalDaily.toFixed(1)} kWh today
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Daily Usage</p>
          <p className="text-2xl font-manrope font-bold">{totalDaily.toFixed(1)}</p>
          <p className="text-xs text-statusActive">kWh</p>
        </div>
        <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Weekly Usage</p>
          <p className="text-2xl font-manrope font-bold">{totalWeekly.toFixed(1)}</p>
          <p className="text-xs text-statusActive">kWh</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-3">Usage by Room (Today)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Room List */}
      <div className="space-y-2">
        {energyData.map((room) => (
          <div
            key={room.room_id}
            className="flex items-center justify-between p-3 rounded-xl bg-background/30"
            data-testid={`energy-room-${room.room_id}`}
          >
            <span className="text-sm font-medium">{room.room_name}</span>
            <span className="text-sm text-statusActive">{room.daily_usage.toFixed(1)} kWh</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EnergyMonitor;