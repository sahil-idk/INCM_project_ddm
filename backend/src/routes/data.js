const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Trial = require('../models/Trial');
const Participant = require('../models/Participant');

// GET /api/data/export - Export all data as CSV
router.get('/export', async (req, res, next) => {
  try {
    // Get all trials with participant data
    const trials = await Trial.find().sort({ participantId: 1, trialNumber: 1 });

    // Get all participants
    const participants = await Participant.find();

    // Create a map of participants for quick lookup
    const participantMap = {};
    participants.forEach(p => {
      participantMap[p.participantId] = p;
    });

    // Combine trial data with participant demographics
    const combinedData = trials.map(trial => {
      const participant = participantMap[trial.participantId];
      return {
        participantId: trial.participantId,
        age: participant?.demographics?.age || '',
        gender: participant?.demographics?.gender || '',
        handedness: participant?.demographics?.handedness || '',
        trialNumber: trial.trialNumber,
        condition: trial.condition,
        coherence: trial.coherence,
        direction: trial.direction,
        response: trial.response,
        rt: trial.rt !== null ? trial.rt : '',
        correct: trial.correct,
        timeout: trial.timeout,
        timestamp: trial.timestamp,
        impulsivity: participant?.postSurvey?.impulsivity || '',
        attention: participant?.postSurvey?.attention || '',
        taskDifficulty: participant?.postSurvey?.taskDifficulty || ''
      };
    });

    // Define CSV fields
    const fields = [
      'participantId',
      'age',
      'gender',
      'handedness',
      'trialNumber',
      'condition',
      'coherence',
      'direction',
      'response',
      'rt',
      'correct',
      'timeout',
      'timestamp',
      'impulsivity',
      'attention',
      'taskDifficulty'
    ];

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(combinedData);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ddm-experiment-data-${Date.now()}.csv`);

    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// GET /api/data/stats - Get overall experiment statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalParticipants = await Participant.countDocuments();
    const completedParticipants = await Participant.countDocuments({
      completedAt: { $ne: null }
    });
    const totalTrials = await Trial.countDocuments();

    // Get average completion time
    const completedWithDuration = await Participant.find({
      totalDuration: { $ne: null }
    });

    const avgDuration = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, p) => sum + p.totalDuration, 0) / completedWithDuration.length
      : 0;

    // Get accuracy stats
    const allTrials = await Trial.find({ condition: { $ne: 'practice' } });
    const correctTrials = allTrials.filter(t => t.correct).length;
    const timeouts = allTrials.filter(t => t.timeout).length;

    res.json({
      success: true,
      stats: {
        totalParticipants,
        completedParticipants,
        inProgressParticipants: totalParticipants - completedParticipants,
        completionRate: totalParticipants > 0
          ? ((completedParticipants / totalParticipants) * 100).toFixed(1) + '%'
          : '0%',
        totalTrials,
        averageDuration: Math.round(avgDuration) + ' seconds',
        overallAccuracy: allTrials.length > 0
          ? ((correctTrials / allTrials.length) * 100).toFixed(1) + '%'
          : '0%',
        timeoutRate: allTrials.length > 0
          ? ((timeouts / allTrials.length) * 100).toFixed(1) + '%'
          : '0%'
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/data/participants - Get list of all participants
router.get('/participants', async (req, res, next) => {
  try {
    const participants = await Participant.find()
      .select('participantId demographics completedAt totalDuration createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
