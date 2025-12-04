// exact-export.js - Exports YOUR exact MongoDB data
const { MongoClient } = require('mongodb');
const fs = require('fs');

// ============================================================================
// CONFIGURATION - REPLACE WITH YOUR CONNECTION STRING
// ============================================================================

// Get your connection string from MongoDB Atlas:
// 1. Click "Cluster0" → "Connect" → "Connect your application"
// 2. Copy the connection string
// 3. Replace <password> with your actual password
// 4. Paste it below:

const MONGODB_URI = 'mongodb+srv://sahil:sahil123@cluster0.fs7e5mo.mongodb.net/?appName=Cluster0';

// Your exact database structure:
const DATABASE_NAME = 'test';
const TRIALS_COLLECTION = 'trials';
const PARTICIPANTS_COLLECTION = 'participants';

// ============================================================================
// EXPORT FUNCTION
// ============================================================================

async function exportData() {
  console.log('=' .repeat(80));
  console.log('EXPORTING DDM EXPERIMENT DATA');
  console.log('=' .repeat(80));
  console.log(`\nOrganization: IIITH`);
  console.log(`Project: INCM`);
  console.log(`Cluster: Cluster0`);
  console.log(`Database: ${DATABASE_NAME}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('\nConnecting to MongoDB Atlas...');
    await client.connect();
    console.log('✓ Connected successfully!');
    
    const db = client.db(DATABASE_NAME);
    
    // ========================================================================
    // STEP 1: Export ALL Trials
    // ========================================================================
    console.log('\n' + '-'.repeat(80));
    console.log('STEP 1: Exporting ALL trials...');
    console.log('-'.repeat(80));
    
    const allTrials = await db.collection(TRIALS_COLLECTION)
      .find({})
      .sort({ participantId: 1, trialNumber: 1 })
      .toArray();
    
    console.log(`✓ Found ${allTrials.length} total trials`);
    
    // Save all trials
    const allTrialsCSV = convertTrialsToCSV(allTrials);
    fs.writeFileSync('ddm_all_trials.csv', allTrialsCSV);
    console.log('✓ Saved: ddm_all_trials.csv');
    
    // ========================================================================
    // STEP 2: Export Participants
    // ========================================================================
    console.log('\n' + '-'.repeat(80));
    console.log('STEP 2: Exporting participants...');
    console.log('-'.repeat(80));
    
    const allParticipants = await db.collection(PARTICIPANTS_COLLECTION)
      .find({})
      .toArray();
    
    console.log(`✓ Found ${allParticipants.length} total participants`);
    
    // Filter completed participants (have completedAt field)
    const completedParticipants = allParticipants.filter(p => p.completedAt);
    console.log(`✓ ${completedParticipants.length} completed participants`);
    
    // Save participants
    const participantsCSV = convertParticipantsToCSV(completedParticipants);
    fs.writeFileSync('ddm_participants.csv', participantsCSV);
    console.log('✓ Saved: ddm_participants.csv');
    
    // ========================================================================
    // STEP 3: Filter Trials to ONLY Completed Participants
    // ========================================================================
    console.log('\n' + '-'.repeat(80));
    console.log('STEP 3: Filtering trials from completed participants...');
    console.log('-'.repeat(80));
    
    const completedParticipantIds = completedParticipants.map(p => p.participantId);
    const completedTrials = allTrials.filter(t => 
      completedParticipantIds.includes(t.participantId)
    );
    
    console.log(`✓ ${completedTrials.length} trials from completed participants`);
    
    // Save completed trials - THIS IS YOUR ANALYSIS FILE!
    const completedTrialsCSV = convertTrialsToCSV(completedTrials);
    fs.writeFileSync('ddm_data_for_analysis.csv', completedTrialsCSV);
    console.log('✓ Saved: ddm_data_for_analysis.csv');
    console.log('  👉 USE THIS FILE FOR YOUR ANALYSIS!');
    
    // ========================================================================
    // STEP 4: Summary Statistics
    // ========================================================================
    console.log('\n' + '='.repeat(80));
    console.log('DATA SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\nPARTICIPANTS:`);
    console.log(`  Total started: ${allParticipants.length}`);
    console.log(`  Completed: ${completedParticipants.length}`);
    console.log(`  Completion rate: ${(completedParticipants.length / allParticipants.length * 100).toFixed(1)}%`);
    
    console.log(`\nTRIALS:`);
    console.log(`  Total collected: ${allTrials.length}`);
    console.log(`  From completed participants: ${completedTrials.length}`);
    console.log(`  Average per completed participant: ${(completedTrials.length / completedParticipants.length).toFixed(1)}`);
    
    // Check conditions
    const baseline = completedTrials.filter(t => t.condition === 'baseline');
    const timePressure = completedTrials.filter(t => t.condition === 'timePressure');
    
    console.log(`\nCONDITIONS:`);
    console.log(`  Baseline: ${baseline.length} trials`);
    console.log(`  Time Pressure: ${timePressure.length} trials`);
    
    // Check coherence levels
    const coherenceCounts = {};
    completedTrials.forEach(t => {
      const coh = t.coherence;
      coherenceCounts[coh] = (coherenceCounts[coh] || 0) + 1;
    });
    
    console.log(`\nCOHERENCE LEVELS:`);
    Object.keys(coherenceCounts).sort().forEach(coh => {
      console.log(`  ${(coh * 100).toFixed(0)}%: ${coherenceCounts[coh]} trials`);
    });
    
    // Quick quality checks
    const validResponses = completedTrials.filter(t => !t.timeout);
    const accuracy = validResponses.filter(t => t.correct).length / validResponses.length * 100;
    const avgRT = validResponses.reduce((sum, t) => sum + (t.rt || 0), 0) / validResponses.length;
    const timeoutRate = completedTrials.filter(t => t.timeout).length / completedTrials.length * 100;
    
    console.log(`\nQUALITY METRICS:`);
    console.log(`  Overall accuracy: ${accuracy.toFixed(1)}%`);
    console.log(`  Average RT: ${avgRT.toFixed(0)}ms`);
    console.log(`  Timeout rate: ${timeoutRate.toFixed(1)}%`);
    
    // Check if data looks reasonable
    console.log(`\nDATA QUALITY CHECK:`);
    if (completedParticipants.length >= 10) {
      console.log(`  ✓ Participant count: GOOD (${completedParticipants.length} ≥ 10)`);
    } else {
      console.log(`  ⚠ Participant count: LOW (${completedParticipants.length} < 10)`);
    }
    
    if (accuracy >= 50 && accuracy <= 95) {
      console.log(`  ✓ Accuracy: REASONABLE (${accuracy.toFixed(1)}%)`);
    } else {
      console.log(`  ⚠ Accuracy: CHECK (${accuracy.toFixed(1)}% - unusual)`);
    }
    
    if (avgRT >= 200 && avgRT <= 3000) {
      console.log(`  ✓ RT: REASONABLE (${avgRT.toFixed(0)}ms)`);
    } else {
      console.log(`  ⚠ RT: CHECK (${avgRT.toFixed(0)}ms - unusual)`);
    }
    
    if (timeoutRate < 40) {
      console.log(`  ✓ Timeout rate: ACCEPTABLE (${timeoutRate.toFixed(1)}%)`);
    } else {
      console.log(`  ⚠ Timeout rate: HIGH (${timeoutRate.toFixed(1)}%)`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('EXPORT COMPLETE!');
    console.log('='.repeat(80));
    console.log('\nGenerated files:');
    console.log('  1. ddm_all_trials.csv - All trial data');
    console.log('  2. ddm_participants.csv - Completed participants info');
    console.log('  3. ddm_data_for_analysis.csv - READY FOR ANALYSIS!');
    console.log('\nNext step: Run analysis on ddm_data_for_analysis.csv');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check your connection string is correct');
    console.error('  2. Make sure your password is correct');
    console.error('  3. Check your IP is whitelisted in MongoDB Atlas');
    console.error('  4. Verify database name is "test"');
  } finally {
    await client.close();
  }
}

// ============================================================================
// CSV CONVERSION FUNCTIONS
// ============================================================================

function convertTrialsToCSV(trials) {
  if (trials.length === 0) {
    return 'participantId,trialNumber,condition,coherence,direction,response,rt,correct,timeout,timestamp\n';
  }
  
  const headers = [
    'participantId',
    'trialNumber',
    'condition',
    'coherence',
    'direction',
    'response',
    'rt',
    'correct',
    'timeout',
    'timestamp'
  ];
  
  let csv = headers.join(',') + '\n';
  
  trials.forEach(trial => {
    const row = [
      trial.participantId || '',
      trial.trialNumber || '',
      trial.condition || '',
      trial.coherence || '',
      trial.direction || '',
      trial.response || '',
      trial.rt || '',
      trial.correct !== undefined ? trial.correct : '',
      trial.timeout !== undefined ? trial.timeout : '',
      trial.timestamp || ''
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

function convertParticipantsToCSV(participants) {
  if (participants.length === 0) {
    return 'participantId,age,gender,handedness,startTime,completedAt,totalDuration\n';
  }
  
  const headers = [
    'participantId',
    'age',
    'gender',
    'handedness',
    'startTime',
    'completedAt',
    'totalDuration'
  ];
  
  let csv = headers.join(',') + '\n';
  
  participants.forEach(p => {
    const row = [
      p.participantId || '',
      p.demographics?.age || '',
      p.demographics?.gender || '',
      p.demographics?.handedness || '',
      p.startTime || '',
      p.completedAt || '',
      p.totalDuration || ''
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

// ============================================================================
// RUN EXPORT
// ============================================================================

exportData();
