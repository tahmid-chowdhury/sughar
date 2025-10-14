
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// FIX: Changed import to relative path.
import { ExpenseData } from '../../types';

interface ExpenseDistributionChartProps {
  data: ExpenseData[];
}

const COLORS = ['#A78BFA', '#F472B6', '#60A5FA', '#FBBF24'];

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
        <ul className="flex flex-wrap justify-center mt-4">
            {payload.map((entry: any, index: number) => {
                 const percent = entry.payload?.percent || 0;
                 return (
                    <li key={`item-${index}`} className="flex items-center mr-4 mb-2 text-sm text-text-secondary">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                        <span>{entry.value} ({(percent * 100).toFixed(0)}%)</span>
                    </li>
                 );
            })}
        </ul>
    );
};

export const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number, name: string, props: any) => {
            const percent = (props.payload?.percent || 0) * 100;
            return [`${percent.toFixed(0)}%`, name];
          }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};