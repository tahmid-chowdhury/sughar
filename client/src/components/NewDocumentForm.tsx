import React, { useState, useRef } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { BUILDING_NAMES } from '../constants';
import { DocumentType } from '../types';
import { ArrowLeft, Upload, X, FileText, CheckCircle2, CloudUpload, ChevronDown } from './icons';

interface NewDocumentFormProps {
  onBack: () => void;
}

interface FormData {
  name: string;
  building: string;
  unit: string;
  documentType: DocumentType;
  description: string;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
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


export const NewDocumentForm: React.FC<NewDocumentFormProps> = ({ onBack }) => {
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
        console.log('Saving document:', formData);
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
                            {Object.values(DocumentType).map(type => (
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

export const NewDocumentFormFixed: React.FC<NewDocumentFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    building: '',
    unit: '',
    documentType: DocumentType.Lease,
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form Data:', formData);
      console.log('Uploaded Files:', uploadedFiles.map(f => ({
        name: f.file.name,
        size: f.file.size,
        type: f.file.type
      })));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Document Uploaded Successfully!</h2>
          <p className="text-gray-600">Your document has been processed and saved.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header title="New Document" />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>
          
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload New Document</h2>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((uploadedFile) => (
                      <div key={uploadedFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(uploadedFile.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== uploadedFile.id))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter document name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building *
                  </label>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Building</option>
                    {Object.values(BUILDING_NAMES).map((building: string) => (
                      <option key={building} value={building}>
                        {building}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., A-101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.values(DocumentType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description or notes"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadedFiles.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};