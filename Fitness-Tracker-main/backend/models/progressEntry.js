const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: Number,
    bodyFat: Number,
    measurements: {
        chest: Number,
        waist: Number,
        hips: Number,
        biceps: Number,
        thighs: Number
    },
    photos: [{
        url: String,
        type: {
            type: String,
            enum: ['front', 'side', 'back']
        }
    }],
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ProgressEntry', ProgressEntrySchema);
