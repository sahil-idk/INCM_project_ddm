const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  demographics: {
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
    },
    handedness: {
      type: String,
      enum: ['right', 'left', 'ambidextrous']
    }
  },
  postSurvey: {
    impulsivity: {
      type: Number,
      min: 1,
      max: 5
    },
    attention: {
      type: Number,
      min: 1,
      max: 5
    },
    taskDifficulty: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  totalDuration: {
    type: Number // seconds
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Generate unique participant ID
participantSchema.statics.generateParticipantId = function() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `P_${timestamp}_${random}`;
};

// Instance method to check if participant completed the experiment
participantSchema.methods.isCompleted = function() {
  return this.completedAt !== null && this.completedAt !== undefined;
};

module.exports = mongoose.model('Participant', participantSchema);
