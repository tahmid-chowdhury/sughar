import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UploadedDocumentData } from '../../types';

interface DocumentsUploadedChartProps {
    data: UploadedDocumentData[];
}

export const DocumentsUploadedChart: React.FC<DocumentsUploadedChartProps> = ({ data }) => {
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
                    <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D8B4FE" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#D8B4FE" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value} documents`, 'Uploaded']}
                    cursor={{ stroke: '#C084FC', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="count" stroke="#A855F7" fillOpacity={1} fill="url(#colorUploads)" strokeWidth={2.5} />
            </AreaChart>
        </ResponsiveContainer>
    );
};