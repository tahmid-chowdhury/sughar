import React, { useState } from 'react';
import { Card } from './Card';
import { ArrowLeft } from './icons';

interface NewUnitFormProps {
  onBack: () => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, className?: string }> = 
({ label, name, value, onChange, placeholder, type = 'text', className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-text-main mb-1">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
        />
    </div>
);

export const NewUnitForm: React.FC<NewUnitFormProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('Buildings');
    const [formData, setFormData] = useState({
        building: '',
        unitName: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        rent: '',
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating unit:', formData);
        onBack();
    };

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Units
            </button>

            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">New Unit Form</h1>
                <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {['Overview', 'Buildings', 'Applications'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab ? 'border-brand-pink text-brand-pink' : 'border-transparent text-inactive-tab hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <Card>
                        <form onSubmit={handleSave} className="space-y-5">
                            <FormInput label="Select Building" name="building" value={formData.building} onChange={handleChange} />
                            <FormInput label="Unit Number/Name" name="unitName" value={formData.unitName} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" />
                                <FormInput label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" />
                            </div>
                            <FormInput label="Square Footage (sq ft)" name="sqft" value={formData.sqft} onChange={handleChange} type="number" />
                            <FormInput label="Monthly Rent" name="rent" value={formData.rent} onChange={handleChange} type="number" />
                            <FormInput label="Occupancy Status" name="status" value={formData.status} onChange={handleChange} />
                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <button type="button" onClick={onBack} className="px-6 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                    Create Unit
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                                {/* Placeholder for image upload UI */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
