const express = require('express');
const router = express.Router();
const UserStats = require('../models/userStats');
const verifyJWTToken = require('../util/auth/verifyJWTToken');

// Get user stats
router.get('/', verifyJWTToken, async (req, res) => {
    try {
        let stats = await UserStats.findOne({ userId: req.userId });
        
        if (!stats) {
            stats = new UserStats({ userId: req.userId });
            await stats.save();
        }
        
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unlock achievement
router.post('/achievements', verifyJWTToken, async (req, res) => {
    try {
        const { achievementId, name, description, points } = req.body;
        
        let stats = await UserStats.findOne({ userId: req.userId });
        if (!stats) {
            stats = new UserStats({ userId: req.userId });
        }
        
        // Check if already unlocked
        const alreadyUnlocked = stats.achievements.some(a => a.achievementId === achievementId);
        if (alreadyUnlocked) {
            return res.status(400).json({ error: 'Achievement already unlocked' });
        }
        
        stats.achievements.push({
            achievementId,
            name,
            description,
            points
        });
        
        const levelUpResult = stats.addXP(points);
        await stats.save();
        
        res.status(200).json({ 
            stats, 
            levelUp: levelUpResult.leveledUp,
            newLevel: levelUpResult.newLevel
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard
router.get('/leaderboard', verifyJWTToken, async (req, res) => {
    try {
        const leaderboard = await UserStats.find()
            .sort({ level: -1, xp: -1 })
            .limit(100)
            .populate('userId', 'username email');
        
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
