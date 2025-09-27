import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingSchema = new Schema({
    raterUserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rateeUserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratingValue: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    ratingDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model('Rating', ratingSchema);
