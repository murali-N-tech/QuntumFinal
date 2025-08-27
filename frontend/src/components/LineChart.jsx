import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// A set of distinct, vibrant colors for the chart lines on a dark background
const COLORS = [
  '#18E6D9', '#43CEA2', '#00BFFF', '#8A2BE2', '#FF69B4', '#FFD700', '#FF4500'
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-quantum-secondary/80 backdrop-blur-sm border border-quantum-border rounded-lg shadow-lg">
          <p className="label text-quantum-text-muted">{`Date : ${label}`}</p>
          {payload.map((pld, index) => (
            <div key={index} style={{ color: pld.color }}>
              <strong>{`${pld.name}: ${pld.value.toFixed(2)}%`}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

const MultiLineChart = ({ data, assets }) => {
  if (!data || data.length === 0 || !assets || assets.length === 0) {
    return <div className="text-center p-4 text-quantum-text-muted">No historical data to display.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" /> {/* quantum-border color */}
          <XAxis dataKey="date" tick={{ fill: '#A0AEC0' }} fontSize={12} /> {/* quantum-text-muted */}
          <YAxis
            tickFormatter={(tick) => `${tick}%`}
            label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft', fill: '#E6F1FF' }}
            tick={{ fill: '#A0AEC0' }} /* quantum-text-muted */
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#E6F1FF', fontSize: '14px' }} />
          {assets.map((asset, index) => (
            <Line
              key={asset}
              type="monotone"
              dataKey={asset}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: COLORS[index % COLORS.length] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineChart;