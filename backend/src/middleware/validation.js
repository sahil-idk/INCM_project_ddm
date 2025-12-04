const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for demographics
const validateDemographics = [
  body('demographics.age')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),
  body('demographics.gender')
    .isIn(['male', 'female', 'non-binary', 'prefer-not-to-say'])
    .withMessage('Invalid gender value'),
  body('demographics.handedness')
    .isIn(['right', 'left', 'ambidextrous'])
    .withMessage('Invalid handedness value'),
  validate
];

// Validation rules for trial data
const validateTrial = [
  body('participantId')
    .isString()
    .notEmpty()
    .withMessage('Participant ID is required'),
  body('trialNumber')
    .isInt({ min: 1, max: 120 })
    .withMessage('Trial number must be between 1 and 120'),
  body('condition')
    .isIn(['baseline', 'timePressure', 'practice'])
    .withMessage('Invalid condition'),
  body('coherence')
    .isFloat()
    .isIn([0.10, 0.25, 0.40])
    .withMessage('Coherence must be 0.10, 0.25, or 0.40'),
  body('direction')
    .isIn(['left', 'right'])
    .withMessage('Direction must be left or right'),
  body('response')
    .isIn(['left', 'right', 'timeout'])
    .withMessage('Response must be left, right, or timeout'),
  body('correct')
    .isBoolean()
    .withMessage('Correct must be a boolean'),
  body('timeout')
    .isBoolean()
    .withMessage('Timeout must be a boolean'),
  validate
];

// Validation rules for post-survey
const validatePostSurvey = [
  body('postSurvey.impulsivity')
    .isInt({ min: 1, max: 5 })
    .withMessage('Impulsivity must be between 1 and 5'),
  body('postSurvey.attention')
    .isInt({ min: 1, max: 5 })
    .withMessage('Attention must be between 1 and 5'),
  body('postSurvey.taskDifficulty')
    .isInt({ min: 1, max: 5 })
    .withMessage('Task difficulty must be between 1 and 5'),
  validate
];

module.exports = {
  validate,
  validateDemographics,
  validateTrial,
  validatePostSurvey
};
