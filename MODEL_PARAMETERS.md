# Model Parameters & Weights Documentation

This document provides complete documentation of all model parameters, experimental parameters, and configuration values used in the DDM experiment. All values are documented for reproducibility.

---

## 🎯 Experimental Parameters

### Random Dot Motion (RDM) Task Configuration

**Location:** `frontend/src/components/RandomDotMotion.jsx`

```javascript
// Visual Parameters
const NUM_DOTS = 200;              // Number of dots in the display
const DOT_RADIUS = 3;              // Radius of each dot in pixels
const DOT_COLOR = '#FFFFFF';       // White dots
const APERTURE_RADIUS = 250;       // Circular aperture radius in pixels
const CANVAS_SIZE = 600;           // Canvas width and height in pixels

// Motion Parameters
const DOT_SPEED = 2;               // Pixels per frame
const FRAME_RATE = 60;             // Target FPS (16.67ms per frame)
const DOT_LIFETIME = 3;            // Frames before dot is replaced

// Coherence Levels (proportion of signal dots)
const COHERENCE_LEVELS = [0.10, 0.25, 0.40];  // 10%, 25%, 40%

// Response Keys
const LEFT_KEYS = ['f', 'F', 'ArrowLeft'];
const RIGHT_KEYS = ['j', 'J', 'ArrowRight'];
```

**Derived Parameters:**
- **Dot density:** 200 dots / (π × 250²) ≈ 1.02 dots per 1000 px²
- **Frame duration:** 1000ms / 60fps ≈ 16.67ms
- **Dot speed:** 2px/frame × 60fps = 120 px/s
- **Average dot lifetime:** 3 frames × 16.67ms ≈ 50ms

---

### Trial Generation Parameters

**Location:** `frontend/src/utils/trialGenerator.js`

```javascript
// Coherence Levels
const coherenceLevels = [0.10, 0.25, 0.40];

// Trial Distribution per Condition (40 trials each)
const trialsPerCoherenceMap = {
  0.10: 13,  // 13 trials at 10% coherence
  0.25: 14,  // 14 trials at 25% coherence
  0.40: 13   // 13 trials at 40% coherence
};
// Total: 13 + 14 + 13 = 40 trials per condition

// Direction Distribution (balanced within each coherence)
// Each coherence level: 50% left, 50% right (±1 for odd numbers)

// Randomization Constraints
const MAX_CONSECUTIVE_SAME_DIRECTION = 3;  // Prevent repetition bias
```

**Practice Trials:**
```javascript
const NUM_PRACTICE_TRIALS = 10;
const PRACTICE_COHERENCE_LEVELS = [0.25, 0.40];  // Easier for learning
const PRACTICE_FEEDBACK = true;
```

**Total Trial Counts:**
- Practice: 10 trials (with feedback)
- Baseline: 40 trials (no time limit)
- Time Pressure: 40 trials (1000ms deadline)
- **Total: 90 trials per participant**

---

### Time Pressure Configuration

**Location:** `frontend/src/components/RandomDotMotion.jsx`

```javascript
// Time Pressure Condition
const TIME_LIMIT = 1000;           // 1000ms response deadline

// Visual Timer Colors
const TIMER_COLORS = {
  safe: '#4CAF50',                 // Green (800-1000ms remaining)
  warning: '#FFC107',              // Yellow (500-800ms remaining)
  danger: '#FF5722'                // Red (0-500ms remaining)
};

// Timeout Handling
const TIMEOUT_MESSAGE = "Too slow!";
const TIMEOUT_DISPLAY_DURATION = 500;  // Show message for 500ms
```

---

## 🧮 DDM Model Parameters

### Classical DDM Parameters

The Drift Diffusion Model is defined by these core parameters:

#### 1. Drift Rate (v)

**Definition:** Rate of evidence accumulation toward the correct boundary

**Units:** Evidence units per second

**Expected Range:** 0.05 to 0.50

**Coherence Dependency:**
```
v = v_base × coherence
```

**Typical Values:**
- 10% coherence: v ≈ 0.10 - 0.15
- 25% coherence: v ≈ 0.20 - 0.30
- 40% coherence: v ≈ 0.30 - 0.40

**Interpretation:**
- Higher v → Faster and more accurate responses
- v increases with stimulus strength (coherence)
- Should be similar across baseline and time pressure

---

#### 2. Boundary Separation (a)

**Definition:** Distance between upper and lower decision boundaries

**Units:** Evidence units

**Expected Range:** 0.5 to 3.0

**Typical Values:**
- **Baseline condition:** a ≈ 1.8 - 2.2 (cautious, accurate)
- **Time Pressure condition:** a ≈ 1.0 - 1.5 (fast, less accurate)

**Interpretation:**
- Higher a → Slower but more accurate (conservative strategy)
- Lower a → Faster but less accurate (liberal strategy)
- **Key prediction:** a decreases under time pressure

**Speed-Accuracy Tradeoff:**
```
Accuracy ≈ 1 / (1 + e^(-2av))
Mean RT ≈ (a/2v) × tanh(av)
```

---

#### 3. Non-Decision Time (Ter)

**Definition:** Time for perceptual encoding + motor execution

**Units:** Seconds (or milliseconds)

**Expected Range:** 200ms - 400ms

**Typical Value:** Ter ≈ 250ms - 350ms

**Components:**
- **Encoding time:** ~150-200ms (stimulus to percept)
- **Motor time:** ~50-100ms (decision to key press)

**Interpretation:**
- Adds constant offset to all RTs
- Should be similar across conditions
- Does not affect accuracy

**Measurement:**
```
Observed RT = Decision Time + Ter
```

---

#### 4. Starting Point (z)

**Definition:** Initial evidence state

**Units:** Proportion of boundary separation (0 to 1)

**Default:** z = 0.5 (unbiased, midpoint)

**Fixed in our implementation:**
```javascript
const STARTING_POINT = 0.5;  // No bias toward left or right
```

**Interpretation:**
- z = 0.5 → Unbiased (equal evidence for both options)
- z > 0.5 → Bias toward upper boundary
- z < 0.5 → Bias toward lower boundary

---

### Adaptive Boundary Model Parameters

**Location:** `adaptive_ddm.py`

The adaptive model extends classical DDM with time-varying boundaries:

#### Collapsing Boundary Function

```python
a(t) = a_end + (a_start - a_end) * exp(-collapse_rate * t)
```

**Parameters:**

1. **a_start** - Initial boundary separation
   - Range: 1.5 to 3.0
   - Typical: 2.0
   - Interpretation: Initial caution level

2. **a_end** - Final boundary separation (asymptotic)
   - Range: 0.5 to 1.5
   - Typical: 1.0
   - Interpretation: Minimum threshold under urgency

3. **collapse_rate** - Speed of boundary collapse
   - Range: 0.5 to 5.0
   - Typical: 2.0
   - Interpretation: Strength of urgency signal
   - Units: 1/second

**Predictions:**
- **Baseline:** collapse_rate ≈ 0 (static boundaries)
- **Time Pressure:** collapse_rate ≈ 2.0 - 3.0 (rapid collapse)

**Time Constants:**
```
Half-life = ln(2) / collapse_rate
  If collapse_rate = 2.0, half-life ≈ 350ms
  If collapse_rate = 3.0, half-life ≈ 230ms
```

---

## 🔬 Simulation Parameters

### Default Simulation Settings

**Location:** All Python analysis scripts

```python
# Simulation Time Parameters
DT = 0.001                  # Time step: 1ms
MAX_TIME = 5.0              # Maximum trial duration: 5 seconds
NOISE_SD = 1.0              # Within-trial noise (fixed)

# Evidence Accumulation
# dx = v * dt + sqrt(dt) * noise
# noise ~ Normal(0, 1)

# Number of Simulations
N_TRIALS_PER_CONDITION = 1000   # For parameter estimation
N_VALIDATION_TRIALS = 100       # For recovery validation
```

---

### Parameter Estimation Grid

**Location:** `simple_parameter_estimation.py`

```python
# Grid Search Ranges
V_RANGE = np.linspace(0.05, 0.50, 20)      # 20 values
A_RANGE = np.linspace(0.5, 3.0, 15)        # 15 values
TER_RANGE = np.linspace(0.2, 0.5, 10)      # 10 values

# Total combinations: 20 × 15 × 10 = 3000 parameter sets
```

**Quantiles for Fitting:**
```python
QUANTILES = [0.1, 0.3, 0.5, 0.7, 0.9]
# Match 10th, 30th, 50th, 70th, 90th percentiles
```

**Objective Function:**
```python
def objective(params, data):
    """Minimize sum of squared differences in RT quantiles"""
    sim_data = simulate_ddm(params)

    error = 0
    for q in QUANTILES:
        error += (quantile(data, q) - quantile(sim_data, q))**2

    return sqrt(error)
```

---

### Parameter Recovery Ground Truth

**Location:** `parameter_recovery_validation.py`

```python
# True parameters for validation
TRUE_PARAMS_BASELINE = {
    'v_low': 0.15,      # 10% coherence
    'v_med': 0.25,      # 25% coherence
    'v_high': 0.35,     # 40% coherence
    'a': 1.8,           # Boundary
    'ter': 0.3          # Non-decision time (300ms)
}

TRUE_PARAMS_TIME_PRESSURE = {
    'v_low': 0.15,      # Same drift rates
    'v_med': 0.25,
    'v_high': 0.35,
    'a': 1.2,           # Lower boundary!
    'ter': 0.3          # Same non-decision time
}
```

**Expected Recovery Quality:**
- Correlation (r) > 0.90
- Mean Absolute Error < 0.05
- Bias < ±0.02

---

## 📊 Data Processing Parameters

### Response Time Filtering

**Location:** `anayze_real_data.py`

```python
# RT filtering (remove outliers)
MIN_RT = 200          # ms (exclude anticipatory responses)
MAX_RT = 5000         # ms (exclude extremely slow responses)

# Typical exclusion rate: 1-3% of trials
```

---

### Statistical Analysis Parameters

**Location:** Various analysis scripts

```python
# Significance Level
ALPHA = 0.05

# Bootstrap Confidence Intervals
N_BOOTSTRAP = 1000
CI_LEVEL = 0.95         # 95% confidence intervals

# MCMC Parameters (for HDDM)
N_SAMPLES = 5000
BURN_IN = 1000
THIN = 1
```

---

## 🎨 Visualization Parameters

### Figure Settings

**Location:** All Python plotting scripts

```python
# Figure Size
FIGURE_SIZE = (12, 8)           # inches
DPI = 300                       # dots per inch

# Font Sizes
TITLE_SIZE = 16
LABEL_SIZE = 14
TICK_SIZE = 12
LEGEND_SIZE = 12

# Colors
COLOR_BASELINE = '#3498db'      # Blue
COLOR_TIME_PRESSURE = '#e74c3c' # Red
COLOR_CORRECT = '#2ecc71'       # Green
COLOR_ERROR = '#e67e22'         # Orange

# Color Palette (colorblind-friendly)
PALETTE = ['#0173B2', '#DE8F05', '#029E73', '#CC78BC',
           '#CA9161', '#949494', '#ECE133']
```

---

## 🔢 Expected Results Ranges

### Behavioral Metrics

Based on pilot data and literature:

**Response Times (median):**
```
Baseline Condition:
  10% coherence: 1000-1400ms
  25% coherence: 800-1100ms
  40% coherence: 700-900ms

Time Pressure Condition:
  10% coherence: 750-1000ms
  25% coherence: 650-850ms
  40% coherence: 550-750ms
```

**Accuracy:**
```
Baseline Condition:
  10% coherence: 60-70%
  25% coherence: 75-85%
  40% coherence: 85-95%

Time Pressure Condition:
  10% coherence: 55-65%
  25% coherence: 70-80%
  40% coherence: 75-90%
```

**Timeout Rates (Time Pressure only):**
```
Expected: 5-15% of trials
Acceptable range: 0-20%
Too high (>25%): Time limit may be too strict
Too low (<2%): Time limit may be too lenient
```

---

### DDM Parameter Estimates

**Expected ranges from literature:**

```
Drift Rate (v):
  Low coherence (10%): 0.10-0.20
  Medium coherence (25%): 0.20-0.30
  High coherence (40%): 0.30-0.45

Boundary Separation (a):
  Baseline: 1.5-2.5
  Time Pressure: 0.8-1.6
  Difference: Δa ≈ 0.5-1.0

Non-Decision Time (ter):
  Range: 250-400ms
  Should be similar across conditions
  Typical: 300ms

Adaptive Parameters:
  Initial boundary (a_start): 1.8-2.5
  Final boundary (a_end): 0.8-1.3
  Collapse rate: 1.5-3.5
```

---

## 🔍 Model Comparison Metrics

### Goodness of Fit

**Metrics used:**

1. **Root Mean Squared Error (RMSE)**
   ```
   RMSE = sqrt(mean((observed - predicted)²))
   Good fit: RMSE < 0.05
   ```

2. **Chi-Square Test**
   ```
   χ² = Σ((observed - expected)² / expected)
   Good fit: p > 0.05 (fail to reject)
   ```

3. **Kolmogorov-Smirnov Test**
   ```
   D = max|F_observed - F_predicted|
   Good fit: p > 0.05
   ```

4. **R² (Variance Explained)**
   ```
   R² = 1 - (SS_residual / SS_total)
   Good fit: R² > 0.80
   ```

---

## 📁 Parameter File Formats

### `estimated_parameters.csv`

```csv
condition,coherence,v,a,ter,rmse
baseline,0.10,0.15,2.05,0.31,0.042
baseline,0.25,0.28,2.05,0.31,0.038
baseline,0.40,0.37,2.05,0.31,0.035
timePressure,0.10,0.14,1.38,0.29,0.045
timePressure,0.25,0.27,1.38,0.29,0.041
timePressure,0.40,0.36,1.38,0.29,0.037
```

### `adaptive_ddm_summary.csv`

```csv
condition,a_start,a_end,collapse_rate,mean_final_a,mean_rt,accuracy
baseline,2.00,2.00,0.0,2.00,891,0.873
timePressure,2.00,1.00,2.5,1.32,654,0.785
```

---

## 🔧 Configuration Files

### Backend Environment Variables

**Location:** `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development|production

# Database
MONGODB_URI=mongodb://localhost:27017/ddm-experiment

# Security
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

**Location:** `frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

---

## 📚 References

**Parameter values based on:**

1. Ratcliff & McKoon (2008). "The Diffusion Decision Model: Theory and Data for Two-Choice Decision Tasks"
   - Typical v: 0.1-0.5
   - Typical a: 0.8-2.5
   - Typical Ter: 0.2-0.5s

2. Bogacz et al. (2010). "Do humans produce the speed–accuracy trade-off that maximizes reward rate?"
   - Boundary adjustment under time pressure

3. Hawkins et al. (2015). "Revisiting the evidence for collapsing boundaries and urgency signals"
   - Collapsing boundary models

4. Palmer et al. (2005). "The effect of stimulus strength on the speed and accuracy of a perceptual decision"
   - RDM coherence effects

---

**Complete Parameter Reference**

All parameters documented here can be found in the codebase at the specified locations. This ensures full reproducibility of the experiment and analyses.

**Last Updated:** December 2025
