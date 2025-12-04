import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="container">
      <h1>Decision-Making Research Study</h1>

      <div className="instructions" style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
          Help us understand how people make quick decisions
        </p>

        <div style={{ marginTop: '2rem' }}>
          <h3>Study Details:</h3>
          <ul>
            <li><strong>Duration:</strong> Approximately 15 minutes</li>
            <li><strong>Task:</strong> Judging direction of moving dots</li>
            <li><strong>Requirements:</strong> Desktop or laptop computer with keyboard</li>
            <li><strong>Compensation:</strong> Contribute to cognitive science research</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>What You'll Do:</h3>
          <ul>
            <li>Complete a brief consent form and demographics survey</li>
            <li>Practice the task (10 trials)</li>
            <li>Complete two experimental conditions (120 trials total)</li>
            <li>Answer a short post-experiment survey</li>
          </ul>
        </div>

        <div className="warning-message" style={{ marginTop: '2rem' }}>
          <strong>Important:</strong> Please use a desktop or laptop computer with a keyboard.
          Mobile devices are not supported for this experiment.
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            <strong>Researcher:</strong> Sahil (Roll Number: 2023122006)
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary btn-block" onClick={onStart}>
          Begin Study
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
