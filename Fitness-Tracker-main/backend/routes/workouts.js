const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const UserStats = require('../models/userStats');
const verifyJWTToken = require('../util/auth/verifyJWTToken');

// Get all workouts for user
router.get('/', verifyJWTToken, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.userId })
            .sort({ date: -1 })
            .limit(50);
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get workout by ID
router.get('/:id', verifyJWTToken, async (req, res) => {
    try {
        const workout = await Workout.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new workout
router.post('/', verifyJWTToken, async (req, res) => {
    try {
        const workout = new Workout({
            ...req.body,
            userId: req.userId
        });
        
        await workout.save();
        
        // Update user stats
        let userStats = await UserStats.findOne({ userId: req.userId });
        if (!userStats) {
            userStats = new UserStats({ userId: req.userId });
        }
        
        userStats.totalWorkouts += 1;
        userStats.totalCaloriesBurned += workout.caloriesBurned || 0;
        userStats.updateStreak();
        const levelUpResult = userStats.addXP(50); // 50 XP per workout
        
        await userStats.save();
        
        res.status(201).json({ 
            workout, 
            levelUp: levelUpResult.leveledUp,
            newLevel: levelUpResult.newLevel,
            stats: userStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update workout
router.put('/:id', verifyJWTToken, async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete workout
router.delete('/:id', verifyJWTToken, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get weekly workout summary
router.get('/summary/weekly', verifyJWTToken, async (req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const workouts = await Workout.find({
            userId: req.userId,
            date: { $gte: weekAgo }
        });
        
        const summary = {
            totalWorkouts: workouts.length,
            totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
            totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            byDay: {}
        };
        
        workouts.forEach(workout => {
            const day = workout.date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!summary.byDay[day]) {
                summary.byDay[day] = { count: 0, calories: 0 };
            }
            summary.byDay[day].count += 1;
            summary.byDay[day].calories += workout.caloriesBurned || 0;
        });
        
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
