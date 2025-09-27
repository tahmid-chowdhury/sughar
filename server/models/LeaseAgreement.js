import mongoose from 'mongoose';
const { Schema } = mongoose;

const leaseAgreementSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unitID: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    documentURL: { type: String }
}, {
    timestamps: true
});

export default mongoose.model('LeaseAgreement', leaseAgreementSchema);
