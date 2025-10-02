import React, { useState } from 'react';
import { Card } from './Card';
import { Tenant } from '../types';
import { Star } from './icons';

interface TenantReviewFormProps {
  tenant: Tenant;
  onSubmit: (reviewData: { ratings: { [key: string]: number }, comment: string }) => void;
}

const StarRating: React.FC<{
    count: number;
    value: number;
    onChange: (value: number) => void;
}> = ({ count, value, onChange }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(count)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        onClick={() => onChange(ratingValue)}
                        className="focus:outline-none"
                    >
                        <Star className={`w-6 h-6 transition-colors ${ratingValue <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                );
            })}
        </div>
    );
};


export const TenantReviewForm: React.FC<TenantReviewFormProps> = ({ tenant, onSubmit }) => {
    const [ratings, setRatings] = useState({
        payment: 0,
        propertyCare: 0,
        communication: 0,
        cleanliness: 0,
        ruleAdherence: 0,
    });
    const [comment, setComment] = useState('');

    const handleRatingChange = (metric: keyof typeof ratings, value: number) => {
        setRatings(prev => ({ ...prev, [metric]: value }));
    };
    
    const isFormComplete = Object.values(ratings).every(r => r > 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!isFormComplete) return;
        onSubmit({ ratings, comment });
    };
    
    const metrics = [
        { key: 'payment', label: 'Payment Reliability' },
        { key: 'propertyCare', label: 'Care of Property' },
        { key: 'communication', label: 'Communication' },
        { key: 'cleanliness', label: 'Cleanliness' },
        { key: 'ruleAdherence', label: 'Adherence to Rules' },
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="space-y-4">
                {metrics.map(({ key, label }) => (
                    <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <label className="text-sm font-medium text-text-main">{label}</label>
                        <StarRating count={5} value={ratings[key as keyof typeof ratings]} onChange={(value) => handleRatingChange(key as keyof typeof ratings, value)} />
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <label htmlFor="comment" className="block text-sm font-medium text-text-main mb-1">Additional Comments (Optional)</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
                />
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={!isFormComplete}
                    className="px-6 py-3 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </form>
    );
};
