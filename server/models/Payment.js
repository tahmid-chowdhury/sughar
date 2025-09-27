import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leaseID: { type: Schema.Types.ObjectId, ref: 'LeaseAgreement', required: true },
    amount: { type: mongoose.Types.Decimal128, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'online'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionID: { type: String },
    notes: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
