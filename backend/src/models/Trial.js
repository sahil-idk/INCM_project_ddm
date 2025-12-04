const mongoose = require('mongoose');

const trialSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    index: true
  },
  trialNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  condition: {
    type: String,
    required: true,
    enum: ['baseline', 'timePressure', 'practice']
  },
  coherence: {
    type: Number,
    required: true,
    enum: [0.10, 0.25, 0.40]
  },
  direction: {
    type: String,
    required: true,
    enum: ['left', 'right']
  },
  response: {
    type: String,
    required: true,
    enum: ['left', 'right', 'timeout']
  },
  rt: {
    type: Number, // milliseconds, null if timeout
    default: null
  },
  correct: {
    type: Boolean,
    required: true
  },
  timeout: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
trialSchema.index({ participantId: 1, trialNumber: 1 });

// Static method to get participant's trial statistics
trialSchema.statics.getParticipantStats = async function(participantId) {
  const trials = await this.find({ participantId });

  const stats = {
    totalTrials: trials.length,
    correctTrials: trials.filter(t => t.correct).length,
    timeouts: trials.filter(t => t.timeout).length,
    averageRT: 0,
    baselineStats: {},
    timePressureStats: {}
  };

  // Calculate average RT (excluding timeouts)
  const validTrials = trials.filter(t => t.rt !== null && !t.timeout);
  if (validTrials.length > 0) {
    stats.averageRT = validTrials.reduce((sum, t) => sum + t.rt, 0) / validTrials.length;
  }

  // Calculate condition-specific stats
  ['baseline', 'timePressure'].forEach(condition => {
    const conditionTrials = trials.filter(t => t.condition === condition);
    const conditionValid = conditionTrials.filter(t => t.rt !== null && !t.timeout);

    stats[`${condition}Stats`] = {
      total: conditionTrials.length,
      correct: conditionTrials.filter(t => t.correct).length,
      timeouts: conditionTrials.filter(t => t.timeout).length,
      averageRT: conditionValid.length > 0
        ? conditionValid.reduce((sum, t) => sum + t.rt, 0) / conditionValid.length
        : 0
    };
  });

  return stats;
};

module.exports = mongoose.model('Trial', trialSchema);
