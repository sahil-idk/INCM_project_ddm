import React from 'react';

const Instructions = ({ onStart }) => {
  return (
    <div className="container">
      <h1>Task Instructions</h1>

      <div className="instructions">
        <h3>THE TASK</h3>
        <p>
          You will see a display of white dots moving on a black screen inside a circular area.
          Some dots will move in a consistent direction (either LEFT or RIGHT), while others
          will move randomly.
        </p>

        <h3>YOUR JOB</h3>
        <p>
          Decide whether the dots are moving predominantly to the <strong>LEFT</strong> or to the <strong>RIGHT</strong>.
        </p>
      </div>

      <div className="key-instructions">
        <h3>HOW TO RESPOND</h3>
        <ul>
          <li>Press <strong>F</strong> key (or <strong>Left Arrow ←</strong>) if dots move LEFT</li>
          <li>Press <strong>J</strong> key (or <strong>Right Arrow →</strong>) if dots move RIGHT</li>
        </ul>
        <p style={{ marginTop: '1rem', fontWeight: '500' }}>
          Keep your left index finger on the <strong>F</strong> key and your right index finger on the <strong>J</strong> key.
        </p>
      </div>

      <div className="instructions">
        <h3>IMPORTANT THINGS TO KNOW</h3>
        <ul>
          <li><strong>Speed and Accuracy:</strong> Respond as QUICKLY and ACCURATELY as possible</li>
          <li><strong>Trust Your Instinct:</strong> Don't overthink it - trust your first impression</li>
          <li><strong>Fixation Cross:</strong> Keep your eyes on the center fixation cross (✚) when it appears</li>
          <li><strong>Two Parts:</strong> The experiment has two parts:
            <ul>
              <li><strong>Part 1 (Baseline):</strong> Take as much time as you need to respond</li>
              <li><strong>Part 2 (Time Pressure):</strong> You'll have only <strong>1 second</strong> to respond</li>
            </ul>
          </li>
          <li><strong>Practice First:</strong> You'll complete 10 practice trials with feedback before the main experiment</li>
          <li><strong>No Feedback:</strong> During the main experiment, you won't see if you're correct or not</li>
        </ul>
      </div>

      <div className="instructions" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
        <h3>TIPS FOR SUCCESS</h3>
        <ul>
          <li>Focus on the overall direction of motion, not individual dots</li>
          <li>Don't try to count dots - use your visual intuition</li>
          <li>Some trials will be easier than others - that's normal!</li>
          <li>Stay relaxed and maintain your concentration</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          The entire experiment takes about <strong>15 minutes</strong>.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>
          Please minimize distractions and complete the experiment in one sitting.
        </p>
        <button className="btn btn-primary btn-block" onClick={onStart}>
          Start Practice Trials
        </button>
      </div>
    </div>
  );
};

export default Instructions;
