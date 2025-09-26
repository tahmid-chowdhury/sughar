import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { RentStatusData } from '../../types';

interface RentStatusChartProps {
  data: RentStatusData[];
}

const COLORS = ['#86EFAC', '#FECACA']; // Green for On Time, Red for Late

const CustomLegend: React.FC<{ payload: any[] }> = ({ payload }) => {
    return (
        <div className="flex justify-center mt-4 space-x-4">
            {payload.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center text-sm text-text-secondary">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.value}</span>
                </li>
            ))}
        </div>
    );
};

export const RentStatusChart: React.FC<RentStatusChartProps> = ({ data }) => {
    const onTimeValue = data.find(d => d.name === 'On Time')?.value || 0;

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
        <ResponsiveContainer width="100%" height="80%">
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-8">
            <div className="text-center">
                 <span className="text-5xl font-atkinson font-bold text-text-main">{onTimeValue}%</span>
                 <p className="text-lg text-text-secondary">On Time</p>
            </div>
        </div>
        <div className="self-center">
            <CustomLegend payload={data.map((entry, index) => ({ value: entry.name, color: COLORS[index] }))} />
        </div>
    </div>
  );
};