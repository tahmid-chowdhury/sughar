
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VacantUnit } from '../../types';

interface VacantUnitsChartProps {
    data: VacantUnit[];
}

export const VacantUnitsChart: React.FC<VacantUnitsChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
                barCategoryGap="35%"
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                     contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                    }}
                    cursor={{fill: 'rgba(235, 212, 248, 0.4)'}}
                />
                <Bar dataKey="vacant" fill="#EBD4F8" radius={[10, 10, 10, 10]} />
            </BarChart>
        </ResponsiveContainer>
    );
};