const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievementId: {
        type: Number,
        required: true
    },
    name: String,
    description: String,
    points: Number,
    unlockedAt: {
        type: Date,
        default: Date.now
    }
});

const UserStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    totalWorkouts: {
        type: Number,
        default: 0
    },
    totalCaloriesBurned: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastWorkoutDate: Date,
    achievements: [AchievementSchema],
    weeklyGoal: {
        type: Number,
        default: 3 // workouts per week
    }
}, {
    timestamps: true
});

// Method to add XP and check for level up
UserStatsSchema.methods.addXP = function(xp) {
    this.xp += xp;
    const xpForNextLevel = this.level * 100;
    
    if (this.xp >= xpForNextLevel) {
        this.level += 1;
        this.xp -= xpForNextLevel;
        return { leveledUp: true, newLevel: this.level };
    }
    
    return { leveledUp: false };
};

// Method to update streak
UserStatsSchema.methods.updateStreak = function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!this.lastWorkoutDate) {
        this.currentStreak = 1;
    } else {
        const lastWorkout = new Date(this.lastWorkoutDate);
        lastWorkout.setHours(0, 0, 0, 0);
        
        const diffTime = today - lastWorkout;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            this.currentStreak += 1;
        } else if (diffDays > 1) {
            this.currentStreak = 1;
        }
    }
    
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }
    
    this.lastWorkoutDate = today;
};

module.exports = mongoose.model('UserStats', UserStatsSchema);
