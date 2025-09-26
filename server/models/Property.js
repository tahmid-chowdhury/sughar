const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    propertyType: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Property', propertySchema);