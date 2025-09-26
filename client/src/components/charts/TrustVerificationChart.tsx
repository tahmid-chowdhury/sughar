import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TrustVerificationChartProps {
  score: number;
}

const data = (score: number) => [
  { name: 'Score', value: score },
  { name: 'Remaining', value: 100 - score },
];

const COLORS = ['#86EFAC', '#F0F0F0'];

export const TrustVerificationChart: React.FC<TrustVerificationChartProps> = ({ score }) => {
  const chartData = data(score);

  return (
    <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                 <span className="text-3xl font-atkinson font-bold text-text-main">{score}%</span>
            </div>
        </div>
    </div>
  );
};