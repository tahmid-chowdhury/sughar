
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export interface RentPaymentData {
  name: string;
  value: number;
  color: string;
}

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="list-none p-0 m-0 space-y-2">
      {payload.map((entry: any, index: number) => {
        const { color, value, payload: { value: numValue } } = entry;
        return (
          <li key={`item-${index}`} className="flex items-center text-sm">
            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: color }}></span>
            <span className="text-text-secondary whitespace-nowrap">{value}: {numValue}%</span>
          </li>
        );
      })}
    </ul>
  );
};

export const RentPaymentChart: React.FC<{ data: RentPaymentData[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="40%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          dataKey="value"
          stroke="none"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          content={<CustomLegend />}
          wrapperStyle={{ width: '50%', paddingLeft: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
