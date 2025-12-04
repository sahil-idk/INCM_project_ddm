import React, { useEffect, useRef, useState } from 'react';

// Dot class for managing individual dots
class Dot {
  constructor(x, y, coherent, direction) {
    this.x = x;
    this.y = y;
    this.coherent = coherent;
    this.direction = direction; // 'left' or 'right'
    this.life = 0;
    this.maxLife = 60; // frames
    this.angle = Math.random() * 2 * Math.PI; // random angle for non-coherent dots
  }

  update(speed, apertureRadius, centerX, centerY) {
    if (this.coherent) {
      // Move coherently (left = 180°, right = 0°)
      this.x += this.direction === 'left' ? -speed : speed;
    } else {
      // Move randomly
      this.x += Math.cos(this.angle) * speed;
      this.y += Math.sin(this.angle) * speed;
    }

    this.life++;

    // Check if outside aperture or exceeded lifetime
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > apertureRadius || this.life > this.maxLife) {
      this.reposition(apertureRadius, centerX, centerY);
    }
  }

  reposition(apertureRadius, centerX, centerY) {
    // Randomly reposition within aperture
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.sqrt(Math.random()) * apertureRadius;
    this.x = centerX + radius * Math.cos(angle);
    this.y = centerY + radius * Math.sin(angle);
    this.life = 0;
    this.angle = Math.random() * 2 * Math.PI; // new random angle
  }

  draw(ctx, centerX, centerY, apertureRadius) {
    // Only draw if inside aperture
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= apertureRadius) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }
}

const RandomDotMotion = ({
  coherence = 0.25,
  direction = 'left',
  onResponse,
  showTimer = false,
  timeLimit = null,
  trialNumber = 1,
  condition = 'baseline',
  isPractice = false
}) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasRespondedRef = useRef(false);
  const timerIntervalRef = useRef(null);

  const [remainingTime, setRemainingTime] = useState(timeLimit ? timeLimit / 1000 : null);
  const [showFixation, setShowFixation] = useState(true);

  // Canvas settings
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;
  const APERTURE_RADIUS = 250;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;
  const NUM_DOTS = 200;
  const DOT_SPEED = 2;

  // Initialize dots
  useEffect(() => {
    console.log(`[RDM] Trial ${trialNumber} starting - Condition: ${condition}, Coherence: ${coherence}, Direction: ${direction}`);

    const dots = [];
    const numCoherentDots = Math.round(NUM_DOTS * coherence);

    // Create coherent dots
    for (let i = 0; i < numCoherentDots; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * APERTURE_RADIUS;
      const x = CENTER_X + radius * Math.cos(angle);
      const y = CENTER_Y + radius * Math.sin(angle);
      dots.push(new Dot(x, y, true, direction));
    }

    // Create non-coherent dots
    for (let i = numCoherentDots; i < NUM_DOTS; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * APERTURE_RADIUS;
      const x = CENTER_X + radius * Math.cos(angle);
      const y = CENTER_Y + radius * Math.sin(angle);
      dots.push(new Dot(x, y, false, direction));
    }

    dotsRef.current = dots;
    console.log(`[RDM] Trial ${trialNumber} - ${numCoherentDots} coherent dots created`);

    // Show fixation cross first
    setShowFixation(true);
    const fixationTimeout = setTimeout(() => {
      console.log(`[RDM] Trial ${trialNumber} - Fixation complete, starting stimulus`);
      setShowFixation(false);
      startTimeRef.current = performance.now();
      hasRespondedRef.current = false;

      // Start countdown timer if time limit exists
      if (timeLimit) {
        startCountdownTimer();
      }

      // Start animation
      animate();
    }, 500); // 500ms fixation

    return () => {
      console.log(`[RDM] Trial ${trialNumber} - Cleanup starting`);
      clearTimeout(fixationTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      console.log(`[RDM] Trial ${trialNumber} - Cleanup complete`);
    };
  }, [trialNumber, coherence, direction, timeLimit]); // Added trialNumber to dependencies

  // Countdown timer
  const startCountdownTimer = () => {
    const startTime = performance.now();

    timerIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = timeLimit - elapsed;

      if (remaining <= 0) {
        setRemainingTime(0);
        clearInterval(timerIntervalRef.current);

        // Trigger timeout if no response yet
        if (!hasRespondedRef.current) {
          hasRespondedRef.current = true;
          handleTimeout();
        }
      } else {
        setRemainingTime((remaining / 1000).toFixed(1));
      }
    }, 50); // Update every 50ms for smooth countdown
  };

  // Handle timeout
  const handleTimeout = () => {
    console.log(`[RDM] Trial ${trialNumber} - TIMEOUT! No response within ${timeLimit}ms`);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const timeoutData = {
      response: 'timeout',
      rt: null,
      correct: false,
      timeout: true
    };

    console.log(`[RDM] Trial ${trialNumber} - Calling onResponse with timeout:`, timeoutData);
    onResponse(timeoutData);
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw aperture
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, APERTURE_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();

    // Update and draw dots
    dotsRef.current.forEach(dot => {
      dot.update(DOT_SPEED, APERTURE_RADIUS, CENTER_X, CENTER_Y);
      dot.draw(ctx, CENTER_X, CENTER_Y, APERTURE_RADIUS);
    });

    // Continue animation if not responded
    if (!hasRespondedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Handle response (keyboard or button click)
  const handleResponse = React.useCallback((response) => {
    if (hasRespondedRef.current || showFixation) return;

    hasRespondedRef.current = true;
    const rt = performance.now() - startTimeRef.current;

    console.log(`[RDM] Trial ${trialNumber} - Response: ${response}, RT: ${Math.round(rt)}ms, Correct: ${response === direction}`);

    // Stop animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Check if correct
    const correct = response === direction;

    const responseData = {
      response,
      rt: Math.round(rt),
      correct,
      timeout: false
    };

    console.log(`[RDM] Trial ${trialNumber} - Calling onResponse with:`, responseData);
    onResponse(responseData);
  }, [trialNumber, direction, showFixation, onResponse]);

  // Handle keyboard response
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (hasRespondedRef.current || showFixation) return;

      let response = null;

      if (e.key === 'f' || e.key === 'F' || e.key === 'ArrowLeft') {
        response = 'left';
      } else if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowRight') {
        response = 'right';
      }

      if (response) {
        handleResponse(response);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResponse]); // handleResponse already includes all dependencies

  // Draw fixation cross
  const drawFixation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw fixation cross
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(CENTER_X - 10, CENTER_Y);
    ctx.lineTo(CENTER_X + 10, CENTER_Y);
    ctx.stroke();

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y - 10);
    ctx.lineTo(CENTER_X, CENTER_Y + 10);
    ctx.stroke();
  };

  // Draw fixation on mount if needed
  useEffect(() => {
    if (showFixation) {
      drawFixation();
    }
  }, [showFixation]);

  return (
    <div className="canvas-container no-select">
      <div className="trial-info">
        <div className="trial-counter">
          Trial {trialNumber} of {condition === 'practice' ? 10 : condition === 'baseline' ? 40 : 80}
        </div>
        <div className="condition-label">
          {condition === 'practice' ? 'Practice' : condition === 'baseline' ? 'Part 1: Baseline' : 'Part 2: Time Pressure'}
        </div>
      </div>

      {showTimer && remainingTime !== null && (
        <div className="timer-display">
          {remainingTime}s
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid #333' }}
      />

      <div className="response-keys">
        Press <strong>F</strong> or <strong>←</strong> for LEFT | Press <strong>J</strong> or <strong>→</strong> for RIGHT
      </div>

      {/* Clickable buttons for mobile support */}
      <div className="response-buttons" style={{
        display: 'flex',
        gap: '2rem',
        marginTop: '2rem',
        justifyContent: 'center'
      }}>
        <button
          className="btn btn-primary"
          onClick={() => handleResponse('left')}
          disabled={showFixation}
          style={{
            fontSize: '1.5rem',
            padding: '1rem 3rem',
            backgroundColor: '#3498db',
            opacity: showFixation ? 0.5 : 1,
            cursor: showFixation ? 'not-allowed' : 'pointer'
          }}
        >
          ← LEFT
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleResponse('right')}
          disabled={showFixation}
          style={{
            fontSize: '1.5rem',
            padding: '1rem 3rem',
            backgroundColor: '#3498db',
            opacity: showFixation ? 0.5 : 1,
            cursor: showFixation ? 'not-allowed' : 'pointer'
          }}
        >
          RIGHT →
        </button>
      </div>
    </div>
  );
};

export default RandomDotMotion;
