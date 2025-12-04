import React, { useState } from 'react';

const ConsentForm = ({ onConsent, onDecline }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e) => {
    const element = e.target;
    const hasReachedBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (hasReachedBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="container">
      <h1>Informed Consent Form</h1>

      <div className="consent-content" onScroll={handleScroll}>
        <h3>Study Information</h3>
        <p>
          <strong>Study Title:</strong> Decision-Making Under Time Pressure: Testing Adaptive Boundary Mechanisms in the Drift Diffusion Model
        </p>
        <p>
          <strong>Researcher:</strong> Sahil (Roll Number: 2023122006)
        </p>
        <p>
          <strong>Duration:</strong> Approximately 12-15 minutes
        </p>

        <h3>Purpose of the Study</h3>
        <p>
          This study investigates how people make decisions under different time constraints using a visual motion task.
          We aim to understand whether decision-making strategies adapt when people face time pressure compared to
          when they have unlimited time to respond.
        </p>

        <h3>What You Will Do</h3>
        <ul>
          <li>View white dots moving on a black screen</li>
          <li>Judge whether the dots are moving predominantly to the LEFT or RIGHT</li>
          <li>Respond using keyboard keys (F for left, J for right)</li>
          <li>Complete 120 trials divided into two conditions:
            <ul>
              <li><strong>Part 1:</strong> Respond at your own pace (60 trials)</li>
              <li><strong>Part 2:</strong> Respond within 1 second (60 trials)</li>
            </ul>
          </li>
          <li>Answer brief demographic questions and a post-experiment survey</li>
        </ul>

        <h3>Risks and Benefits</h3>
        <p>
          <strong>Risks:</strong> This study involves minimal risk. Some participants may experience mild eye strain
          or fatigue from viewing the computer screen. You may take breaks as needed, and you are free to withdraw
          from the study at any time without penalty.
        </p>
        <p>
          <strong>Benefits:</strong> While there may be no direct benefit to you, your participation will contribute
          to our understanding of human decision-making and cognitive processes. This research may help develop better
          models of how people make decisions under time pressure.
        </p>

        <h3>Confidentiality and Data Privacy</h3>
        <ul>
          <li>Your data will be <strong>completely anonymous</strong></li>
          <li>No personally identifiable information will be collected</li>
          <li>Your responses will be assigned a random participant ID</li>
          <li>Data will be stored securely and used only for research purposes</li>
          <li>Results may be published in academic journals or presented at conferences, but individual
              participants will never be identifiable</li>
        </ul>

        <h3>Voluntary Participation</h3>
        <ul>
          <li>Your participation is completely <strong>voluntary</strong></li>
          <li>You may withdraw from the study at any time without penalty</li>
          <li>You may skip any questions you do not wish to answer</li>
          <li>Withdrawing will not affect your relationship with the institution</li>
        </ul>

        <h3>Contact Information</h3>
        <p>
          If you have any questions about this study, please contact the researcher through your institution's
          research department.
        </p>

        <h3>Consent Statement</h3>
        <p>
          By clicking "I Consent to Participate" below, you confirm that:
        </p>
        <ul>
          <li>You are <strong>18 years of age or older</strong></li>
          <li>You have read and understood the information provided above</li>
          <li>You understand that your participation is voluntary</li>
          <li>You understand that you may withdraw at any time</li>
          <li>You voluntarily agree to participate in this research study</li>
        </ul>
      </div>

      <div className="button-group">
        <button className="btn btn-success" onClick={onConsent}>
          I Consent to Participate
        </button>
        <button className="btn btn-danger" onClick={onDecline}>
          I Do Not Consent
        </button>
      </div>

      {!hasScrolled && (
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Please scroll through the entire consent form before proceeding
        </p>
      )}
    </div>
  );
};

export default ConsentForm;
