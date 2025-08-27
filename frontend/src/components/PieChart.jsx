import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A new, vibrant, and clear color palette for the chart
const COLORS = [
  '#18E6D9', // quantum-glow
  '#43CEA2', // quantum-accent
  '#00BFFF', // Deep Sky Blue
  '#8A2BE2', // Blue Violet
  '#FF69B4', // Hot Pink
  '#FFD700', // Gold
  '#FF4500', // Orange Red
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-quantum-secondary/80 backdrop-blur-sm border border-quantum-border rounded-lg">
        <p className="text-quantum-text font-bold">{`${payload[0].name}: ${(payload[0].value * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const PortfolioPieChart = ({ data }) => {
  if (!data) return null;

  const chartData = Object.keys(data)
    .map(key => ({ name: key, value: data[key] }))
    .filter(item => item.value > 0.001); // Filter out tiny, unreadable slices

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius="60%" // Creates the "donut" effect
          outerRadius="85%"
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={""} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          wrapperStyle={{
            color: '#A0AEC0', // quantum-text-muted
            fontSize: '14px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PortfolioPieChart;