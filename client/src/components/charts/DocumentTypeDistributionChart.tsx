import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DocumentDistribution } from '../../types';

interface DocumentTypeDistributionChartProps {
  data: DocumentDistribution[];
}

const COLORS = ['#A7F3D0', '#D8B4FE', '#FDE68A', '#A5B4FC'];

const Legend: React.FC<{ data: DocumentDistribution[] }> = ({ data }) => (
    <div className="flex-1 space-y-2">
        {data.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-text-secondary">{entry.name}</span>
                </div>
                <span className="font-bold text-text-main">{entry.percentage}</span>
            </div>
        ))}
    </div>
);

export const DocumentTypeDistributionChart: React.FC<DocumentTypeDistributionChartProps> = ({ data }) => {
  return (
    <div className="flex items-center h-full">
        <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none"/>
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
       <Legend data={data} />
    </div>
  );
};