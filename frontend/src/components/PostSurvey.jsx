import React, { useState } from 'react';

const PostSurvey = ({ onSubmit }) => {
  const [responses, setResponses] = useState({
    impulsivity: null,
    attention: null,
    taskDifficulty: null
  });

  const handleChange = (question, value) => {
    setResponses(prev => ({
      ...prev,
      [question]: parseInt(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (responses.impulsivity && responses.attention && responses.taskDifficulty) {
      onSubmit(responses);
    }
  };

  const isFormComplete = responses.impulsivity && responses.attention && responses.taskDifficulty;

  return (
    <div className="container">
      <h1>Quick Survey</h1>

      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Thank you for completing the experiment! Please answer these final 3 questions.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Question 1: Impulsivity */}
        <div className="survey-question">
          <label style={{ fontSize: '1.1rem' }}>
            1. How impulsive would you say you are in general?
          </label>
          <div className="radio-group" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map(value => (
              <div key={value} className="radio-option" style={{ flex: 1, textAlign: 'center' }}>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="impulsivity"
                    value={value}
                    checked={responses.impulsivity === value}
                    onChange={(e) => handleChange('impulsivity', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <span>{value}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="scale-labels">
            <span>Not at all impulsive</span>
            <span>Very impulsive</span>
          </div>
        </div>

        {/* Question 2: Attention */}
        <div className="survey-question">
          <label style={{ fontSize: '1.1rem' }}>
            2. How well can you focus and maintain attention on tasks?
          </label>
          <div className="radio-group" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map(value => (
              <div key={value} className="radio-option" style={{ flex: 1, textAlign: 'center' }}>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="attention"
                    value={value}
                    checked={responses.attention === value}
                    onChange={(e) => handleChange('attention', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <span>{value}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="scale-labels">
            <span>Very poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Question 3: Task Difficulty */}
        <div className="survey-question">
          <label style={{ fontSize: '1.1rem' }}>
            3. How difficult did you find this task overall?
          </label>
          <div className="radio-group" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4, 5].map(value => (
              <div key={value} className="radio-option" style={{ flex: 1, textAlign: 'center' }}>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="taskDifficulty"
                    value={value}
                    checked={responses.taskDifficulty === value}
                    onChange={(e) => handleChange('taskDifficulty', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <span>{value}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="scale-labels">
            <span>Very easy</span>
            <span>Very difficult</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={!isFormComplete}
          >
            Submit Survey
          </button>
        </div>
      </form>

      {!isFormComplete && (
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Please answer all questions before submitting
        </p>
      )}
    </div>
  );
};

export default PostSurvey;
