

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// FIX: Changed import to relative path.
import { RevenueData } from '../../types';

interface MonthlyRevenueChartProps {
    data: RevenueData[];
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EBD4F8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EBD4F8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D8B4FE" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    );
};