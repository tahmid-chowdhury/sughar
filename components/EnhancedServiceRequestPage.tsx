import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { RequestStatus, AppData, ServiceRequestComment, ServiceRequestMedia, UserRole, ActivityLogItem, ActivityLogType } from '../types';
import { ArrowLeft, Paperclip, Image as ImageIcon, Send, User as UserIcon, CheckCircle, Clock, AlertCircle } from './icons';

interface EnhancedServiceRequestPageProps {
    serviceRequestId: string;
    appData: AppData;
    onBack: () => void;
    currentUser?: AppData['users'][0];
    onAddComment: (serviceRequestId: string, comment: ServiceRequestComment) => void;
    onAddMedia: (serviceRequestId: string, media: ServiceRequestMedia[]) => void;
    onAssignContractor: (serviceRequestId: string, contractorId: string) => void;
    onMarkAsViewed: (serviceRequestId: string) => void;
}

const StatusPill: React.FC<{ status: RequestStatus; isLarge?: boolean }> = ({ status, isLarge = false }) => {
    const styles = {
        [RequestStatus.Complete]: 'bg-green-100 text-green-700',
        [RequestStatus.InProgress]: 'bg-yellow-100 text-yellow-700',
        [RequestStatus.Pending]: 'bg-red-100 text-red-700',
    };
    const sizeClass = isLarge ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs';

    return (
        <span className={`font-semibold rounded-full ${styles[status]} ${sizeClass} inline-flex items-center`}>
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-current"></span>
            {status}
        </span>
    );
};

const ActivityTimelineItem: React.FC<{ activity: ActivityLogItem; isLast: boolean }> = ({ activity, isLast }) => {
    const getIcon = () => {
        switch (activity.type) {
            case ActivityLogType.Created:
                return <AlertCircle className="w-5 h-5" />;
            case ActivityLogType.Viewed:
                return <UserIcon className="w-5 h-5" />;
            case ActivityLogType.ContractorAssigned:
                return <UserIcon className="w-5 h-5" />;
            case ActivityLogType.StatusChanged:
                return <CheckCircle className="w-5 h-5" />;
            case ActivityLogType.CommentAdded:
                return <Send className="w-5 h-5" />;
            case ActivityLogType.MediaUploaded:
                return <ImageIcon className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const getColor = () => {
        switch (activity.type) {
            case ActivityLogType.Created:
                return 'bg-blue-500';
            case ActivityLogType.Viewed:
                return 'bg-purple-500';
            case ActivityLogType.ContractorAssigned:
                return 'bg-indigo-500';
            case ActivityLogType.StatusChanged:
                return 'bg-green-500';
            case ActivityLogType.CommentAdded:
                return 'bg-pink-500';
            case ActivityLogType.MediaUploaded:
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex gap-4 relative">
            {/* Timeline line */}
            {!isLast && <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-gray-200"></div>}
            
            {/* Icon */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full ${getColor()} text-white flex items-center justify-center z-10`}>
                {getIcon()}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                    <span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
                {activity.description && <p className="text-sm text-gray-600">{activity.description}</p>}
                {activity.userName && <p className="text-xs text-gray-500 mt-1">by {activity.userName}</p>}
            </div>
        </div>
    );
};

export const EnhancedServiceRequestPage: React.FC<EnhancedServiceRequestPageProps> = ({ 
    serviceRequestId, 
    appData, 
    onBack, 
    currentUser,
    onAddComment,
    onAddMedia,
    onAssignContractor,
    onMarkAsViewed,
}) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [commentText, setCommentText] = useState('');
    const [showContractorModal, setShowContractorModal] = useState(false);

    const requestData = appData.serviceRequests.find(sr => sr.id === serviceRequestId);
    const requester = requestData ? appData.tenants.find(t => t.id === requestData.tenantId) : undefined;
    const building = requestData ? appData.buildings.find(b => b.id === requestData.buildingId) : undefined;
    const unit = requestData ? appData.units.find(u => u.id === requestData.unitId) : undefined;
    
    // Get activity logs for this service request
    const activityLogs = appData.activityLogs
        .filter(log => log.relatedEntityId === serviceRequestId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Check if current user is landlord/manager
    const isLandlord = currentUser?.role === UserRole.Landlord || currentUser?.role === UserRole.BuildingManager;
    const isTenant = currentUser?.role === UserRole.Tenant;

    // Mark as viewed when landlord opens the request
    useEffect(() => {
        if (isLandlord && requestData && !requestData.viewedByLandlord) {
            onMarkAsViewed(serviceRequestId);
        }
    }, [isLandlord, requestData, serviceRequestId, onMarkAsViewed]);

    if (!requestData || !requester || !building) {
        return (
            <div className="container mx-auto text-center p-8">
                <h2 className="text-2xl text-text-secondary">Service Request not found.</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const handleSendComment = () => {
        if (!commentText.trim() || !currentUser) return;

        const comment: ServiceRequestComment = {
            id: `COMMENT-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatarUrl,
            userRole: currentUser.role,
            message: commentText,
            timestamp: new Date().toISOString(),
        };

        onAddComment(serviceRequestId, comment);
        setCommentText('');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const mediaItems: ServiceRequestMedia[] = Array.from(files).map(file => ({
            type: file.type.startsWith('video/') ? 'video' : 'image',
            url: URL.createObjectURL(file),
            filename: file.name,
            uploadedAt: new Date().toISOString(),
        }));

        onAddMedia(serviceRequestId, mediaItems);
    };

    const tabs = ['Overview', 'Media', 'Activity', 'Comments'];

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-medium">Back to Service Requests</span>
                </button>
                <StatusPill status={requestData.status} isLarge />
            </div>

            {/* Title and ID */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{requestData.title}</h1>
                <p className="text-gray-500">Request ID: {requestData.id}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 font-medium transition-colors relative ${
                                activeTab === tab 
                                    ? 'text-brand-pink border-b-2 border-brand-pink' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                            {tab === 'Comments' && requestData.comments && requestData.comments.length > 0 && (
                                <span className="ml-2 bg-brand-pink text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                                    {requestData.comments.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {activeTab === 'Overview' && (
                        <Card>
                            {/* Requester Info */}
                            <div className="flex items-center mb-6 pb-6 border-b">
                                <img src={requester.avatar} alt={requester.name} className="w-16 h-16 rounded-full" />
                                <div className="ml-4">
                                    <h3 className="font-bold text-lg text-gray-800">{requester.name}</h3>
                                    <p className="text-sm text-gray-600">Tenant</p>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Request Date</p>
                                    <p className="text-sm font-medium text-gray-800">{requestData.requestDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Building</p>
                                    <p className="text-sm font-medium text-gray-800">{building.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Unit</p>
                                    <p className="text-sm font-medium text-gray-800">{unit?.unitNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                                    <p className={`text-sm font-bold ${
                                        requestData.priority === 'High' ? 'text-red-600' :
                                        requestData.priority === 'Medium' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>{requestData.priority}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">{requestData.description}</p>
                            </div>

                            {/* Contractor Section */}
                            {isLandlord && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-bold text-gray-800 mb-3">Assigned Contractor</h4>
                                    {requestData.assignedContractor ? (
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <img src={requestData.assignedContractor.avatar} alt={requestData.assignedContractor.name} className="w-12 h-12 rounded-full" />
                                                <div className="ml-3">
                                                    <p className="font-semibold text-gray-800">{requestData.assignedContractor.name}</p>
                                                    {requestData.assignedContractor.rating && (
                                                        <p className="text-sm text-yellow-600">★ {requestData.assignedContractor.rating}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowContractorModal(true)}
                                                className="text-sm text-brand-pink hover:text-pink-700 font-medium"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowContractorModal(true)}
                                            className="w-full bg-brand-pink text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition-colors"
                                        >
                                            Assign Contractor
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'Media' && (
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Photos & Videos</h3>
                            {requestData.media && requestData.media.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {requestData.media.map((item, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt={item.filename || 'Media'} className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={item.url} controls className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No media uploaded yet</p>
                            )}
                            
                            {/* Upload Button */}
                            <div className="mt-6">
                                <label className="block">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-pink transition-colors">
                                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload photos or videos</p>
                                    </div>
                                </label>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'Activity' && (
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Activity Timeline</h3>
                            <div className="space-y-1">
                                {activityLogs.map((log, idx) => (
                                    <ActivityTimelineItem 
                                        key={log.id} 
                                        activity={log} 
                                        isLast={idx === activityLogs.length - 1} 
                                    />
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'Comments' && (
                        <Card>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Comments</h3>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {requestData.comments && requestData.comments.length > 0 ? (
                                    requestData.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-800">{comment.userName}</span>
                                                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{comment.userRole}</span>
                                                    <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-700">{comment.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No comments yet</p>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="border-t pt-4">
                                <div className="flex gap-3">
                                    <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-pink focus:border-transparent resize-none"
                                            rows={3}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={handleSendComment}
                                                disabled={!commentText.trim()}
                                                className="bg-brand-pink text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="font-bold text-gray-800 mb-4">Quick Info</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <StatusPill status={requestData.status} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-sm font-medium">{new Date(requestData.requestDate).toLocaleDateString()}</p>
                            </div>
                            {requestData.completionDate && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Completed</p>
                                    <p className="text-sm font-medium">{new Date(requestData.completionDate).toLocaleDateString()}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Comments</p>
                                <p className="text-sm font-medium">{requestData.comments?.length || 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Media Files</p>
                                <p className="text-sm font-medium">{requestData.media?.length || 0}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Contractor Assignment Modal */}
            {showContractorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Select Contractor</h2>
                            <button onClick={() => setShowContractorModal(false)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            {appData.contractors.filter(c => c.isActive).map(contractor => (
                                <button
                                    key={contractor.id}
                                    onClick={() => {
                                        onAssignContractor(serviceRequestId, contractor.id);
                                        setShowContractorModal(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-brand-pink hover:bg-pink-50 transition-colors"
                                >
                                    <img src={contractor.avatar} alt={contractor.name} className="w-14 h-14 rounded-full" />
                                    <div className="flex-1 text-left">
                                        <h4 className="font-semibold text-gray-800">{contractor.name}</h4>
                                        <p className="text-sm text-gray-600">{contractor.specialties.join(', ')}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-yellow-600">★ {contractor.rating}</span>
                                            <span className="text-sm text-gray-500">• {contractor.phone}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
