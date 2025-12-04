import React from 'react';

const BreakScreen = ({ onContinue }) => {
  return (
    <div className="container">
      <div className="break-screen">
        <h1>Great Progress!</h1>

        <div style={{ fontSize: '1.2rem', margin: '2rem 0' }}>
          <p style={{ color: '#27ae60', fontWeight: '500' }}>
            ✓ You've completed Part 1 (Baseline Condition)
          </p>
        </div>

        <div className="instructions" style={{ textAlign: 'left', margin: '2rem 0' }}>
          <h3>What's Next: Part 2 (Time Pressure Condition)</h3>

          <p style={{ marginTop: '1rem' }}>
            In the next part, you will need to respond <strong>within 1 second</strong>.
          </p>

          <div className="warning-message" style={{ margin: '1.5rem 0' }}>
            <strong>Important Changes:</strong>
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
              <li>A countdown timer will appear showing time remaining</li>
              <li>You must respond before the timer reaches 0</li>
              <li>If you don't respond in time, you'll see "Too slow!" message</li>
              <li>Try to respond as quickly AND accurately as possible</li>
            </ul>
          </div>

          <div className="key-instructions">
            <strong>Reminder:</strong>
            <ul style={{ marginTop: '0.5rem' }}>
              <li>Press <strong>F</strong> or <strong>←</strong> for LEFT</li>
              <li>Press <strong>J</strong> or <strong>→</strong> for RIGHT</li>
            </ul>
          </div>
        </div>

        <div style={{ margin: '2rem 0' }}>
          <p style={{ fontSize: '1rem', color: '#666' }}>
            Take a short break if you need it. When you're ready, click continue.
          </p>
        </div>

        <button className="btn btn-success btn-block" onClick={onContinue}>
          Continue to Part 2
        </button>
      </div>
    </div>
  );
};

export default BreakScreen;
