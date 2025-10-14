
import React, { useState } from 'react';
import { Card } from './Card';
import { ArrowLeft } from './icons';
import { BuildingDetail, BuildingCategory } from '../types';

interface NewBuildingFormProps {
  onBack: () => void;
  onAddBuilding: (buildingData: Omit<BuildingDetail, 'id' | 'vacantUnits' | 'requests' | 'occupation' | 'rentCollection' | 'contact'> & { totalUnits: number }) => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string }> = 
({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
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
            required
        />
    </div>
);

const FormSelect: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> =
({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-main mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
            required
        >
            <option value="" disabled>Select a category</option>
            {/* FIX: Correctly type `cat` to resolve `key` prop error. */}
            {Object.values(BuildingCategory).map((cat: BuildingCategory) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
    </div>
);


export const NewBuildingForm: React.FC<NewBuildingFormProps> = ({ onBack, onAddBuilding }) => {
    const [activeTab, setActiveTab] = useState('Buildings');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        category: BuildingCategory.Standard,
        totalUnits: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'totalUnits' ? parseInt(value, 10) : value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onAddBuilding(formData);
        onBack();
    };

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Buildings
            </button>

            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">New Building Form</h1>
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
                            <FormInput label="Building Name" name="name" value={formData.name} onChange={handleChange} />
                            <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />
                            <FormSelect label="Category" name="category" value={formData.category} onChange={handleChange} />
                            <FormInput label="Number of Units" name="totalUnits" value={formData.totalUnits} onChange={handleChange} type="number" />
                            
                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <button type="button" onClick={onBack} className="px-6 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                    Save Building
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
