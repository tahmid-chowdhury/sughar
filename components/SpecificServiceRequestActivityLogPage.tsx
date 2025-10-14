
import React from 'react';
import { Card } from './Card';
import { SpecificServiceRequestDetail, ActivityLogItem, ActivityLogType } from '../types';
import { CalendarDays, Settings, Check, MessageSquare, ChevronRight } from './icons';

interface SpecificServiceRequestActivityLogPageProps {
  requestData: SpecificServiceRequestDetail;
}

const activityIcons = {
    [ActivityLogType.Scheduled]: { icon: CalendarDays, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    [ActivityLogType.Arrived]: { icon: Settings, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    [ActivityLogType.Completed]: { icon: Check, color: 'text-green-600', bgColor: 'bg-green-100' },
};

const TimelineItem: React.FC<{ item: ActivityLogItem, isLast: boolean }> = ({ item, isLast }) => {
    const { icon: Icon, color, bgColor } = activityIcons[item.type];
    const dotColor = item.type === ActivityLogType.Completed ? 'bg-green-500' : 'bg-purple-500';

    return (
        <div className="relative pl-12 pb-8">
            {!isLast && <div className="absolute left-[22px] top-5 h-full w-0.5 bg-gray-200"></div>}
            <div className="absolute left-0 top-2.5 flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${dotColor} border-4 border-background`}></div>
            </div>
            <Card className="!p-4">
                <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${bgColor} mr-4`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-text-main">{item.title}</p>
                        <p className="text-xs text-text-secondary mb-2">{item.timestamp}</p>
                        {item.description && <p className="text-sm text-text-secondary bg-gray-50 p-3 rounded-md">{item.description}</p>}
                    </div>
                </div>
            </Card>
        </div>
    );
};


export const SpecificServiceRequestActivityLogPage: React.FC<SpecificServiceRequestActivityLogPageProps> = ({ requestData }) => {
    const { activityLog, requestInfo, notes } = requestData;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    {activityLog?.map((item, index) => (
                        <TimelineItem key={index} item={item} isLast={index === activityLog.length - 1} />
                    ))}
                </div>
                
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Add Activity</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Event Type" className="md:col-span-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-brand-pink focus:border-brand-pink" />
                            <input type="text" value="Sep 21, 2025" className="md:col-span-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-brand-pink focus:border-brand-pink" />
                            <input type="text" value="11:00 AM" className="md:col-span-1 w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-brand-pink focus:border-brand-pink" />
                        </div>
                        <div>
                            <textarea placeholder="Add a note (optional)" rows={3} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-brand-pink focus:border-brand-pink"></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-accent-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors">
                                Save
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
                {requestInfo && (
                    <Card>
                        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Request Info</h3>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-3xl font-bold text-text-main">{requestInfo.timeOpen}</p>
                                <p className="text-sm text-text-secondary">Days Time Open</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-text-main">{requestInfo.updates}</p>
                                <p className="text-sm text-text-secondary">Updates</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-text-main">{requestInfo.notes}</p>
                                <p className="text-sm text-text-secondary">Notes</p>
                            </div>
                        </div>
                    </Card>
                )}

                {notes && notes.length > 0 && (
                     <Card>
                        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Notes</h3>
                        <div className="flex items-center">
                             <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                <MessageSquare className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="flex-1 text-sm text-text-main font-medium">{notes[0].text}</p>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};