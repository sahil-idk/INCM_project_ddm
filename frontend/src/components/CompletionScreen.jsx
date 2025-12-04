import React from 'react';

const CompletionScreen = ({ participantId, stats }) => {
  return (
    <div className="container">
      <div className="completion-screen">
        <h1>Thank You for Participating!</h1>

        <div className="success-message" style={{ margin: '2rem 0' }}>
          <strong>✓ Your responses have been recorded successfully</strong>
        </div>

        <div className="participant-id-box">
          <strong>YOUR PARTICIPANT ID:</strong>
          <div style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: '#2c3e50' }}>
            {participantId}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#666' }}>
            (Please save this for your records)
          </div>
        </div>

        {stats && (
          <div style={{ margin: '2rem 0', textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Performance Summary</h3>
            <div className="instructions">
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>Total Trials:</strong> {stats.total}
                </li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>Correct Responses:</strong> {stats.correct} ({((stats.correct / stats.total) * 100).toFixed(1)}%)
                </li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>Average Response Time:</strong> {Math.round(stats.averageRT)} ms
                </li>
                {stats.timeouts > 0 && (
                  <li style={{ padding: '0.5rem 0' }}>
                    <strong>Timeouts:</strong> {stats.timeouts}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="debrief">
          <h3>STUDY DEBRIEF</h3>

          <p>
            This study investigates how people adjust their decision-making strategies under time pressure.
            We use computational models called <strong>Drift Diffusion Models (DDM)</strong> to understand the
            cognitive processes underlying your responses.
          </p>

          <p>
            Traditional DDM assumes people use fixed decision boundaries - a fixed amount of evidence needed
            before making a choice. However, recent theories suggest that people may use <strong>adaptive
            boundaries</strong> that change based on task demands, such as time pressure.
          </p>

          <p>
            Your data will help us test whether adaptive boundary models better explain human decision-making
            compared to classical fixed-boundary models. By comparing your performance in the baseline condition
            (no time limit) with the time pressure condition (1-second limit), we can analyze whether and how
            your decision strategy changed.
          </p>

          <h3>WHAT HAPPENS NEXT?</h3>
          <p>
            Your anonymous data will be analyzed along with data from other participants. Results may be
            published in academic journals or presented at scientific conferences. Individual participants
            will never be identifiable in any publications or presentations.
          </p>

          <h3>QUESTIONS OR CONCERNS?</h3>
          <p>
            If you have any questions about this study or would like to learn about the results, please
            contact the researcher through your institution's research department.
          </p>

          <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <strong>Thank you again for your valuable contribution to science!</strong>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            You may now close this window.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
