const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    exercises: [{
        exerciseId: Number,
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
        duration: Number,
        completed: Boolean
    }],
    duration: {
        type: Number, // in minutes
        default: 0
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    notes: String,
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', WorkoutSchema);
