import mongoose from 'mongoose';
const { Schema } = mongoose;

const documentSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    propertyID: { type: Schema.Types.ObjectId, ref: 'Property' },
    unitID: { type: Schema.Types.ObjectId, ref: 'Unit' },
    documentName: { type: String, required: true },
    documentType: { 
        type: String, 
        required: true,
        enum: [
            'lease_agreement', 
            'rental_application', 
            'inspection_report', 
            'maintenance_receipt', 
            'insurance_document',
            'property_deed',
            'financial_statement',
            'other'
        ]
    },
    fileURL: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    fileSize: { type: Number },
    mimeType: { type: String },
    description: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('Document', documentSchema);
