const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const { validateDemographics, validatePostSurvey } = require('../middleware/validation');

// POST /api/participants/create - Create new participant
router.post('/create', async (req, res, next) => {
  try {
    const participantId = Participant.generateParticipantId();

    const participant = new Participant({
      participantId,
      startTime: new Date()
    });

    await participant.save();

    res.status(201).json({
      success: true,
      participantId,
      createdAt: participant.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/participants/:id/demographics - Update demographics
router.post('/:id/demographics', validateDemographics, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { demographics } = req.body;

    const participant = await Participant.findOne({ participantId: id });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    participant.demographics = demographics;
    await participant.save();

    res.json({
      success: true,
      message: 'Demographics saved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/participants/:id/complete - Mark participant as completed
router.post('/:id/complete', validatePostSurvey, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { postSurvey, completedAt } = req.body;

    const participant = await Participant.findOne({ participantId: id });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    participant.postSurvey = postSurvey;
    participant.completedAt = completedAt || new Date();

    // Calculate total duration in seconds
    if (participant.startTime) {
      const duration = (participant.completedAt - participant.startTime) / 1000;
      participant.totalDuration = Math.round(duration);
    }

    await participant.save();

    res.json({
      success: true,
      message: 'Experiment completed successfully',
      totalDuration: participant.totalDuration
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/participants/:id - Get participant details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const participant = await Participant.findOne({ participantId: id });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }

    res.json({
      success: true,
      participant
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
