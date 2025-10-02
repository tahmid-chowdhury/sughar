
import React, { useState } from 'react';
import { Card } from './Card';
import { ArrowLeft, ChevronDown, CloudUpload } from './icons';
import { DocumentType, Document } from '../types';

interface NewDocumentFormProps {
  onBack: () => void;
  onAddDocument: (docData: Omit<Document, 'id' | 'uploadDate'>) => void;
}

const FormInput: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string }> = 
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
        />
    </div>
);

const FormSelect: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> =
({ label, name, value, onChange, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-main mb-1">
            {label}
        </label>
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
            >
                {children}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    </div>
);


export const NewDocumentForm: React.FC<NewDocumentFormProps> = ({ onBack, onAddDocument }) => {
    const [formData, setFormData] = useState({
        documentName: '',
        documentType: DocumentType.Lease,
        associateWith: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // NOTE: This is a simplified implementation. A real app would parse 'associateWith'
        // to link to a specific building/unit/tenant.
        onAddDocument({
            name: formData.documentName,
            type: formData.documentType,
            building: 'B-001',
            unit: 'N/A',
        });
        onBack();
    };

    return (
        <div className="container mx-auto">
             <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documents
            </button>
            <h1 className="text-3xl font-bold font-atkinson text-text-main mb-6">New Document Form</h1>

            <div className="max-w-xl mx-auto">
                <Card>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-accent-secondary hover:bg-purple-50 transition-colors">
                            <CloudUpload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="font-semibold text-text-main">Drag & drop files here or click to browse</p>
                        </div>
                        <FormInput label="Document Name" name="documentName" value={formData.documentName} onChange={handleChange} />
                        <FormSelect label="Document Type" name="documentType" value={formData.documentType} onChange={handleChange}>
                            {/* FIX: Correctly type `type` to resolve `key` prop error. */}
                            {Object.values(DocumentType).map((type: DocumentType) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </FormSelect>
                         <FormInput label="Associate With" name="associateWith" value={formData.associateWith} onChange={handleChange} placeholder="e.g., Building Name, Unit #, Tenant Name" />
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button type="button" onClick={onBack} className="px-6 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                                Upload and Save
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
