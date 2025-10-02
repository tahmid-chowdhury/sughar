
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RentCollection } from '../../types';

interface RentCollectionChartProps {
    data: RentCollection[];
}

export const RentCollectionChart: React.FC<RentCollectionChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EBD4F8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EBD4F8" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} width={10}/>
                <Tooltip 
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Rent Collected']}
                />
                <Area type="monotone" dataKey="rent" stroke="#C084FC" fillOpacity={1} fill="url(#colorRent)" strokeWidth={2.5} />
            </AreaChart>
        </ResponsiveContainer>
    );
};