import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyProfitData } from '../../types';

interface FinancialOverviewChartProps {
    data: MonthlyProfitData[];
}

export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 20,
                    left: -10,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8B4FE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D8B4FE" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke="#A855F7" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2.5} />
            </AreaChart>
        </ResponsiveContainer>
    );
};