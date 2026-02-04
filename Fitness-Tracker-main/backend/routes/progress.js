const express = require('express');
const router = express.Router();
const ProgressEntry = require('../models/progressEntry');
const verifyJWTToken = require('../util/auth/verifyJWTToken');

// Get all progress entries
router.get('/', verifyJWTToken, async (req, res) => {
    try {
        const entries = await ProgressEntry.find({ userId: req.userId })
            .sort({ date: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create progress entry
router.post('/', verifyJWTToken, async (req, res) => {
    try {
        const entry = new ProgressEntry({
            ...req.body,
            userId: req.userId
        });
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get latest entry
router.get('/latest', verifyJWTToken, async (req, res) => {
    try {
        const entry = await ProgressEntry.findOne({ userId: req.userId })
            .sort({ date: -1 });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete progress entry
router.delete('/:id', verifyJWTToken, async (req, res) => {
    try {
        await ProgressEntry.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        res.status(200).json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
