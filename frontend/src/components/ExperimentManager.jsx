import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import ConsentForm from './ConsentForm';
import Demographics from './Demographics';
import Instructions from './Instructions';
import RandomDotMotion from './RandomDotMotion';
import BreakScreen from './BreakScreen';
import PostSurvey from './PostSurvey';
import CompletionScreen from './CompletionScreen';
import { generatePracticeTrials, generateBaselineTrials, generateTimePressureTrials } from '../utils/trialGenerator';
import dataManager, { preventPageUnload } from '../utils/dataManager';
import api from '../utils/api';

const ExperimentManager = () => {
  // Experiment state
  const [stage, setStage] = useState('landing'); // landing, consent, demographics, instructions, practice, baseline, break, timePressure, postSurvey, completion
  const [participantId, setParticipantId] = useState(null);
  const [demographics, setDemographics] = useState(null);

  // Trial state
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentTrial, setCurrentTrial] = useState(null);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // correct, incorrect, timeout

  // Statistics
  const [experimentStats, setExperimentStats] = useState(null);

  // Error handling
  const [error, setError] = useState(null);

  // Initialize participant when consent is given
  const handleConsent = async () => {
    try {
      const response = await api.createParticipant();
      const newParticipantId = response.participantId;

      setParticipantId(newParticipantId);
      dataManager.initialize(newParticipantId);

      setStage('demographics');
    } catch (err) {
      setError('Failed to initialize participant. Please try again.');
      console.error(err);
    }
  };

  const handleDecline = () => {
    alert('You have declined to participate. You may now close this window.');
    window.close();
  };

  const handleDemographicsSubmit = async (demographicsData) => {
    try {
      await api.submitDemographics(participantId, demographicsData);
      setDemographics(demographicsData);
      setStage('instructions');
    } catch (err) {
      setError('Failed to save demographics. Please try again.');
      console.error(err);
    }
  };

  const handleStartPractice = () => {
    console.log('[ExpManager] Starting practice trials');
    const practiceTrials = generatePracticeTrials(10);
    console.log('[ExpManager] Generated practice trials:', practiceTrials.length);
    setTrials(practiceTrials);
    setCurrentTrialIndex(0);
    setCurrentTrial(practiceTrials[0]);
    setStage('practice');

    // Enable page unload prevention
    preventPageUnload(true);
    console.log('[ExpManager] Practice stage initialized, first trial set');
  };

  const handleStartBaseline = () => {
    const baselineTrials = generateBaselineTrials();
    setTrials(baselineTrials);
    setCurrentTrialIndex(0);
    setCurrentTrial(baselineTrials[0]);
    setStage('baseline');
  };

  const handleStartTimePressure = () => {
    const timePressureTrials = generateTimePressureTrials();
    setTrials(timePressureTrials);
    setCurrentTrialIndex(0);
    setCurrentTrial(timePressureTrials[0]);
    setStage('timePressure');
  };

  const handleTrialResponse = async (responseData) => {
    console.log(`[ExpManager] Trial ${currentTrialIndex + 1}/${trials.length} - Response received:`, responseData);

    // Save trial data
    const trialData = {
      ...currentTrial,
      ...responseData
    };

    console.log(`[ExpManager] Complete trial data:`, trialData);

    // Only save non-practice trials to database
    if (stage !== 'practice') {
      console.log(`[ExpManager] Saving trial to dataManager (stage: ${stage})`);
      dataManager.addTrial(trialData);
    } else {
      console.log(`[ExpManager] Skipping save (practice trial)`);
    }

    // Show feedback if practice trial
    if (currentTrial.showFeedback) {
      console.log(`[ExpManager] Showing feedback for practice trial`);
      if (responseData.timeout) {
        setFeedbackType('timeout');
        setFeedbackMessage('Too slow!');
      } else if (responseData.correct) {
        setFeedbackType('correct');
        setFeedbackMessage('✓ Correct!');
      } else {
        setFeedbackType('incorrect');
        setFeedbackMessage('✗ Incorrect');
      }

      setShowFeedback(true);

      // Hide feedback after 1 second
      setTimeout(() => {
        console.log(`[ExpManager] Hiding feedback, proceeding to next trial`);
        setShowFeedback(false);
        proceedToNextTrial();
      }, 1000);
    } else {
      // Show timeout message for time pressure condition
      if (responseData.timeout && stage === 'timePressure') {
        console.log(`[ExpManager] Showing timeout message for time pressure trial`);
        setFeedbackType('timeout');
        setFeedbackMessage('Too slow! Please respond faster');
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
          proceedToNextTrial();
        }, 500);
      } else {
        // Small delay before next trial
        console.log(`[ExpManager] Proceeding to next trial after 300ms delay`);
        setTimeout(() => {
          proceedToNextTrial();
        }, 300);
      }
    }
  };

  const proceedToNextTrial = () => {
    const nextIndex = currentTrialIndex + 1;
    console.log(`[ExpManager] proceedToNextTrial - Current: ${currentTrialIndex}, Next: ${nextIndex}, Total: ${trials.length}`);

    if (nextIndex < trials.length) {
      // More trials in current condition
      console.log(`[ExpManager] Moving to trial ${nextIndex + 1}/${trials.length}`);
      setCurrentTrialIndex(nextIndex);
      setCurrentTrial(trials[nextIndex]);
      console.log(`[ExpManager] Next trial set:`, trials[nextIndex]);
    } else {
      // Finished current condition
      console.log(`[ExpManager] Condition complete! Stage: ${stage}`);
      if (stage === 'practice') {
        console.log('[ExpManager] Practice complete, starting baseline');
        setStage('baseline');
        handleStartBaseline();
      } else if (stage === 'baseline') {
        console.log('[ExpManager] Baseline complete, submitting trials and showing break');
        // Submit buffered trials before break
        dataManager.submitBufferedTrials();
        setStage('break');
      } else if (stage === 'timePressure') {
        console.log('[ExpManager] Time pressure complete, submitting all trials');
        // Submit all remaining trials
        dataManager.submitAllTrials();
        setStage('postSurvey');
      }
    }
  };

  const handlePostSurveySubmit = async (surveyData) => {
    try {
      // Submit post-survey and mark as complete
      await api.completeExperiment(participantId, surveyData, new Date().toISOString());

      // Get final statistics
      const stats = dataManager.getStats();
      setExperimentStats(stats);

      // Disable page unload prevention
      preventPageUnload(false);

      // Clear localStorage backup
      dataManager.clearLocalStorage();

      setStage('completion');
    } catch (err) {
      setError('Failed to save survey. Your data has been saved locally.');
      console.error(err);

      // Still show completion screen even if submission failed
      const stats = dataManager.getStats();
      setExperimentStats(stats);
      preventPageUnload(false);
      setStage('completion');
    }
  };

  // Render current stage
  const renderStage = () => {
    switch (stage) {
      case 'landing':
        return <LandingPage onStart={() => setStage('consent')} />;

      case 'consent':
        return <ConsentForm onConsent={handleConsent} onDecline={handleDecline} />;

      case 'demographics':
        return <Demographics onSubmit={handleDemographicsSubmit} />;

      case 'instructions':
        return <Instructions onStart={handleStartPractice} />;

      case 'practice':
      case 'baseline':
      case 'timePressure':
        return currentTrial ? (
          <RandomDotMotion
            coherence={currentTrial.coherence}
            direction={currentTrial.direction}
            onResponse={handleTrialResponse}
            showTimer={stage === 'timePressure'}
            timeLimit={currentTrial.timeLimit || null}
            trialNumber={stage === 'practice' ? currentTrialIndex + 1 : currentTrial.trialNumber}
            condition={stage}
            isPractice={stage === 'practice'}
          />
        ) : null;

      case 'break':
        return <BreakScreen onContinue={handleStartTimePressure} />;

      case 'postSurvey':
        return <PostSurvey onSubmit={handlePostSurveySubmit} />;

      case 'completion':
        return <CompletionScreen participantId={participantId} stats={experimentStats} />;

      default:
        return <div>Unknown stage</div>;
    }
  };

  return (
    <>
      {error && (
        <div className="error-message" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, maxWidth: '500px' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '1rem' }}>✕</button>
        </div>
      )}

      {showFeedback && (
        <div className={`feedback-message feedback-${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}

      {renderStage()}
    </>
  );
};

export default ExperimentManager;
