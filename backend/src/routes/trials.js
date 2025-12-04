const express = require('express');
const router = express.Router();
const Trial = require('../models/Trial');
const { validateTrial } = require('../middleware/validation');

// POST /api/trials/submit - Submit trial data (can be single or batch)
router.post('/submit', async (req, res, next) => {
  try {
    const { participantId, trials } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'Participant ID is required'
      });
    }

    if (!trials || !Array.isArray(trials)) {
      return res.status(400).json({
        success: false,
        error: 'Trials must be an array'
      });
    }

    // Add participantId to each trial
    const trialsToInsert = trials.map(trial => ({
      ...trial,
      participantId
    }));

    // Bulk insert trials
    const insertedTrials = await Trial.insertMany(trialsToInsert);

    res.status(201).json({
      success: true,
      trialsRecorded: insertedTrials.length,
      message: `${insertedTrials.length} trials recorded successfully`
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/trials/:participantId - Get all trials for a participant
router.get('/:participantId', async (req, res, next) => {
  try {
    const { participantId } = req.params;

    const trials = await Trial.find({ participantId }).sort({ trialNumber: 1 });

    res.json({
      success: true,
      count: trials.length,
      trials
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/trials/:participantId/stats - Get participant statistics
router.get('/:participantId/stats', async (req, res, next) => {
  try {
    const { participantId } = req.params;

    const stats = await Trial.getParticipantStats(participantId);

    res.json({
      success: true,
      participantId,
      stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
