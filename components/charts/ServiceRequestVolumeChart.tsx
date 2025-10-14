

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ServiceRequestVolume } from '../../types';

interface ServiceRequestVolumeChartProps {
    data: ServiceRequestVolume[];
}

const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
        <ul className="flex flex-wrap justify-center -mt-2">
            {payload.map((entry: any, index: number) => (
                <li key={`item-${index}`} className="flex items-center mr-4 text-sm text-text-secondary">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

export const ServiceRequestVolumeChart: React.FC<ServiceRequestVolumeChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 20,
                }}
                barCategoryGap="35%"
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                     contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                    }}
                    cursor={{fill: 'rgba(235, 212, 248, 0.4)'}}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '25px'}} content={<CustomLegend />} />
                <Bar dataKey="new" name="New" fill="#F472B6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#A78BFA" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};