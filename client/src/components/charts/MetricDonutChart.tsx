// NOTE: This component is not currently used in the application.
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MetricDonutChartProps {
  value: number; // A value between 0 and 100
  color: string;
  backgroundColor?: string;
  label: string;
}

export const MetricDonutChart: React.FC<MetricDonutChartProps> = ({ 
    value, 
    color, 
    backgroundColor = '#F3F4F6',
    label
}) => {
  const data = [
    { name: 'value', value: value },
    { name: 'remaining', value: 100 - value },
  ];
  const COLORS = [color, backgroundColor];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                 <span className="text-4xl font-atkinson font-bold text-text-main">{value}%</span>
                 <p className="text-md text-text-secondary">{label}</p>
            </div>
        </div>
    </div>
  );
};
