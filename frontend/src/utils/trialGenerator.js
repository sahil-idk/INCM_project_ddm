// Trial generator for creating randomized trial sequences

// Fisher-Yates shuffle algorithm
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate trial sequence for a condition
function generateConditionTrials(condition, coherenceLevels, trialsPerCoherenceMap) {
  const trials = [];

  coherenceLevels.forEach(coherence => {
    // Get number of trials for this coherence level
    const trialsForCoherence = trialsPerCoherenceMap[coherence];

    // Create roughly equal number of left and right trials
    const leftTrials = Math.floor(trialsForCoherence / 2);
    const rightTrials = trialsForCoherence - leftTrials; // Handles odd numbers

    for (let i = 0; i < leftTrials; i++) {
      trials.push({
        condition,
        coherence,
        direction: 'left'
      });
    }

    for (let i = 0; i < rightTrials; i++) {
      trials.push({
        condition,
        coherence,
        direction: 'right'
      });
    }
  });

  // Shuffle trials
  return shuffle(trials);
}

// Ensure no more than N consecutive trials in the same direction
function enforceDirectionConstraint(trials, maxConsecutive = 3) {
  const result = [...trials];
  let modified = true;

  while (modified) {
    modified = false;
    for (let i = 0; i <= result.length - maxConsecutive - 1; i++) {
      // Check if next maxConsecutive+1 trials are all the same direction
      const directions = result.slice(i, i + maxConsecutive + 1).map(t => t.direction);
      const allSame = directions.every(d => d === directions[0]);

      if (allSame) {
        // Find a trial further ahead with different direction and swap
        for (let j = i + maxConsecutive + 1; j < result.length; j++) {
          if (result[j].direction !== directions[0]) {
            [result[i + maxConsecutive], result[j]] = [result[j], result[i + maxConsecutive]];
            modified = true;
            break;
          }
        }
      }
    }
  }

  return result;
}

// Generate practice trials
export function generatePracticeTrials(numTrials = 10) {
  const trials = [];

  // Mostly easy trials (40% coherence) for practice
  const coherenceDistribution = [
    ...Array(6).fill(0.40),  // 6 easy trials
    ...Array(3).fill(0.25),  // 3 medium trials
    ...Array(1).fill(0.10)   // 1 hard trial
  ];

  for (let i = 0; i < numTrials; i++) {
    trials.push({
      trialNumber: i + 1,
      condition: 'practice',
      coherence: coherenceDistribution[i],
      direction: Math.random() < 0.5 ? 'left' : 'right',
      showFeedback: true
    });
  }

  return shuffle(trials);
}

// Generate baseline trials (no time pressure)
export function generateBaselineTrials() {
  const coherenceLevels = [0.10, 0.25, 0.40];

  // Trial distribution: 13 + 14 + 13 = 40 total trials
  const trialsPerCoherenceMap = {
    0.10: 13,  // 13 trials at 10% coherence (6-7 left, 6-7 right)
    0.25: 14,  // 14 trials at 25% coherence (7 left, 7 right)
    0.40: 13   // 13 trials at 40% coherence (6-7 left, 6-7 right)
  };

  let trials = generateConditionTrials('baseline', coherenceLevels, trialsPerCoherenceMap);

  // Enforce constraint: no more than 3 consecutive trials in same direction
  trials = enforceDirectionConstraint(trials, 3);

  // Add trial numbers (starting from 1)
  return trials.map((trial, index) => ({
    ...trial,
    trialNumber: index + 1,
    showFeedback: false
  }));
}

// Generate time pressure trials
export function generateTimePressureTrials() {
  const coherenceLevels = [0.10, 0.25, 0.40];

  // Trial distribution: 13 + 14 + 13 = 40 total trials
  const trialsPerCoherenceMap = {
    0.10: 13,  // 13 trials at 10% coherence (6-7 left, 6-7 right)
    0.25: 14,  // 14 trials at 25% coherence (7 left, 7 right)
    0.40: 13   // 13 trials at 40% coherence (6-7 left, 6-7 right)
  };

  let trials = generateConditionTrials('timePressure', coherenceLevels, trialsPerCoherenceMap);

  // Enforce constraint: no more than 3 consecutive trials in same direction
  trials = enforceDirectionConstraint(trials, 3);

  // Add trial numbers (starting from 41 for continuity)
  return trials.map((trial, index) => ({
    ...trial,
    trialNumber: index + 41,
    showFeedback: false,
    timeLimit: 1000 // 1 second time limit
  }));
}

// Generate complete experiment trial sequence
export function generateAllTrials() {
  return {
    practice: generatePracticeTrials(10),
    baseline: generateBaselineTrials(),
    timePressure: generateTimePressureTrials()
  };
}

// Validate trial structure
export function validateTrial(trial) {
  const requiredFields = ['trialNumber', 'condition', 'coherence', 'direction'];
  const validConditions = ['practice', 'baseline', 'timePressure'];
  const validCoherences = [0.10, 0.25, 0.40];
  const validDirections = ['left', 'right'];

  for (const field of requiredFields) {
    if (!(field in trial)) {
      throw new Error(`Trial missing required field: ${field}`);
    }
  }

  if (!validConditions.includes(trial.condition)) {
    throw new Error(`Invalid condition: ${trial.condition}`);
  }

  if (!validCoherences.includes(trial.coherence)) {
    throw new Error(`Invalid coherence: ${trial.coherence}`);
  }

  if (!validDirections.includes(trial.direction)) {
    throw new Error(`Invalid direction: ${trial.direction}`);
  }

  return true;
}
