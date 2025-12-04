// Data manager for handling trial data storage and submission

import api, { retryRequest } from './api';

class DataManager {
  constructor() {
    this.participantId = null;
    this.trialBuffer = [];
    this.allTrials = [];
    this.batchSize = 20; // Submit every 20 trials
    this.localStorageKey = 'ddm_experiment_backup';
  }

  // Initialize with participant ID
  initialize(participantId) {
    this.participantId = participantId;
    this.trialBuffer = [];
    this.allTrials = [];

    // Save participant ID to localStorage
    this.saveToLocalStorage({
      participantId,
      trials: [],
      lastUpdate: new Date().toISOString()
    });
  }

  // Add trial to buffer
  addTrial(trialData) {
    const trial = {
      ...trialData,
      timestamp: new Date().toISOString()
    };

    this.trialBuffer.push(trial);
    this.allTrials.push(trial);

    // Auto-save to localStorage
    this.saveToLocalStorage({
      participantId: this.participantId,
      trials: this.allTrials,
      lastUpdate: new Date().toISOString()
    });

    // Auto-submit if buffer reaches batch size
    if (this.trialBuffer.length >= this.batchSize) {
      this.submitBufferedTrials();
    }
  }

  // Submit buffered trials to backend
  async submitBufferedTrials() {
    if (this.trialBuffer.length === 0) return { success: true };

    const trialsToSubmit = [...this.trialBuffer];

    try {
      // Retry up to 3 times
      const result = await retryRequest(
        () => api.submitTrials(this.participantId, trialsToSubmit),
        3,
        1000
      );

      // Clear buffer on success
      this.trialBuffer = [];

      console.log(`✓ Submitted ${trialsToSubmit.length} trials successfully`);
      return result;
    } catch (error) {
      console.error('Failed to submit trials:', error);

      // Keep trials in buffer for retry
      // Save to localStorage as backup
      this.saveToLocalStorage({
        participantId: this.participantId,
        trials: this.allTrials,
        lastUpdate: new Date().toISOString(),
        error: error.message
      });

      return { success: false, error: error.message };
    }
  }

  // Force submit all remaining trials
  async submitAllTrials() {
    return this.submitBufferedTrials();
  }

  // Save data to localStorage as backup
  saveToLocalStorage(data) {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Load data from localStorage
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  // Clear localStorage backup
  clearLocalStorage() {
    try {
      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Download data as JSON (fallback)
  downloadAsJSON() {
    const data = {
      participantId: this.participantId,
      trials: this.allTrials,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ddm-experiment-${this.participantId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Get statistics
  getStats() {
    const validTrials = this.allTrials.filter(t => !t.timeout && t.rt !== null);

    return {
      total: this.allTrials.length,
      correct: this.allTrials.filter(t => t.correct).length,
      timeouts: this.allTrials.filter(t => t.timeout).length,
      averageRT: validTrials.length > 0
        ? validTrials.reduce((sum, t) => sum + t.rt, 0) / validTrials.length
        : 0
    };
  }

  // Get trials by condition
  getTrialsByCondition(condition) {
    return this.allTrials.filter(t => t.condition === condition);
  }
}

// Create singleton instance
const dataManager = new DataManager();

// Prevent page refresh/close during experiment
export function preventPageUnload(enabled = true) {
  const handler = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  };

  if (enabled) {
    window.addEventListener('beforeunload', handler);
  } else {
    window.removeEventListener('beforeunload', handler);
  }
}

export default dataManager;
