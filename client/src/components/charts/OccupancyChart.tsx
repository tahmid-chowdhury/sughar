

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Occupancy } from '../../types';

interface OccupancyChartProps {
  data: Occupancy[];
}

const COLORS = ['#86EFAC', '#BBF7D0'];

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
        <ul className="flex justify-center mt-4 space-x-4">
            {payload.map((entry: any, index: number) => (
                <li key={`item-${index}`} className="flex items-center text-sm text-text-secondary">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
    const totalOccupied = data.find(d => d.name === 'Occupied')?.value || 0;

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
                    endAngle={450}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
                </Pie>
                <Legend content={<CustomLegend />} verticalAlign="bottom" align="center" wrapperStyle={{paddingTop: '20px'}}/>
            </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-8">
            <div className="text-center">
                 <span className="text-5xl font-atkinson font-bold text-text-main">{totalOccupied}%</span>
            </div>
        </div>
    </div>
  );
};