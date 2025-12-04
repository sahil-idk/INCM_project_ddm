# DDM Experiment - Drift Diffusion Model Research Application

A complete web-based experiment application for testing adaptive decision boundary mechanisms under time pressure. Built for computational neuroscience research.

## 📋 Overview

This application implements a Random Dot Motion (RDM) task to investigate how people adjust their decision-making strategies under time pressure. The experiment collects behavioral data to test whether adaptive boundary models better explain human decision-making compared to classical fixed-boundary Drift Diffusion Models (DDM).

### Research Details

- **Researcher:** Sahil (Roll Number: 2023122006)
- **Duration:** 10-12 minutes per participant
- **Total Trials:** 80 trials (40 baseline + 40 time pressure)
- **Practice Trials:** 10 trials with feedback
- **Target:** 50 participants

---

## 🏗️ Project Structure

```
ddm-experiment/
├── frontend/                           # React frontend (Vite)
│   ├── src/
│   │   ├── components/                # UI components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ConsentForm.jsx
│   │   │   ├── Demographics.jsx
│   │   │   ├── Instructions.jsx
│   │   │   ├── RandomDotMotion.jsx   # Core RDM task
│   │   │   ├── ExperimentManager.jsx  # Experiment flow control
│   │   │   ├── BreakScreen.jsx
│   │   │   ├── PostSurvey.jsx
│   │   │   └── CompletionScreen.jsx
│   │   ├── utils/                     # Utility functions
│   │   │   ├── trialGenerator.js     # Trial randomization
│   │   │   ├── dataManager.js        # Data handling
│   │   │   └── api.js                # API communication
│   │   ├── styles/
│   │   │   └── theme.css             # Modern design system
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                            # Node.js/Express backend
│   ├── src/
│   │   ├── models/                    # MongoDB models
│   │   │   ├── Participant.js
│   │   │   └── Trial.js
│   │   ├── routes/                    # API routes
│   │   │   ├── participants.js
│   │   │   ├── trials.js
│   │   │   └── data.js
│   │   ├── middleware/                # Validation & error handling
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   ├── scripts/
│   │   └── cleanDatabase.js          # Database cleanup utility
│   └── package.json
├── analysis/                           # Python analysis scripts
│   ├── adaptive_ddm.py               # Adaptive boundary simulation
│   ├── simple_parameter_estimation.py # Grid search parameter estimation
│   ├── parameter_recovery_validation.py # Parameter recovery validation
│   ├── anayze_real_data.py          # Real data analysis
│   ├── compare_real_vs_simulation.py # Model comparison
│   ├── comprehensive_figure.py       # Publication figures
│   ├── quick_hddm.py                # HDDM Bayesian estimation
│   └── emergency_ddm_simulation.py   # Quick DDM simulation
├── exact-export.js                    # MongoDB data export script
├── requirements.txt                   # Python dependencies
├── README.md                          # This file
├── QUICK_DEPLOY.md                   # Deployment guide
└── DEPLOYMENT.md                     # Detailed deployment docs
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Python** 3.8+ (for data analysis)
- Desktop/laptop with keyboard (mobile not supported)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd INCM_project-
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
touch .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ddm-experiment
CORS_ORIGIN=http://localhost:5173
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ddm-experiment?retryWrites=true&w=majority
```

#### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
touch .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

#### 4. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🧪 Experiment Flow

1. **Landing Page** - Study overview
2. **Consent Form** - Informed consent
3. **Demographics** - Age, gender, handedness
4. **Instructions** - Task explanation with visual demo
5. **Practice** - 10 trials with feedback
6. **Part A: Baseline** - 40 trials, no time limit
7. **Break Screen** - Brief pause (30 seconds)
8. **Part B: Time Pressure** - 40 trials, 1-second deadline
9. **Post-Survey** - 3 questions (impulsivity, attention, difficulty)
10. **Completion** - Debrief and participant ID

---

## 🎮 Task Specifications

### Random Dot Motion (RDM) Parameters

- **Canvas:** 600×600px, black background
- **Dots:** 200 white dots, 3px radius
- **Aperture:** Circular, 250px radius (centered)
- **Coherence levels:** 10%, 25%, 40%
- **Dot speed:** 2 pixels/frame
- **Target frame rate:** 60 FPS
- **Dot lifetime:** 3 frames (50ms)
- **Response keys:** F/← for LEFT, J/→ for RIGHT
- **Mobile buttons:** Clickable LEFT/RIGHT buttons below canvas

### Trial Distribution

**Practice (10 trials):**
- Mixed coherence levels
- Feedback provided ("Correct!" / "Incorrect")
- Familiarization with task

**Baseline Condition (40 trials):**
- No time limit
- Coherence distribution:
  - 13 trials at 10% coherence (6-7 left, 6-7 right)
  - 14 trials at 25% coherence (7 left, 7 right)
  - 13 trials at 40% coherence (6-7 left, 6-7 right)
- No feedback
- Randomized order with direction constraint (max 3 consecutive same direction)

**Time Pressure Condition (40 trials):**
- 1000ms response deadline
- Visual countdown timer (yellow → orange → red)
- Same coherence distribution as baseline
- "Too slow!" message for timeouts
- Same randomization constraints

---

## 📊 Data Collection

### Trial-Level Data

```javascript
{
  participantId: "P_1699824738_x7k9m2",
  trialNumber: 1,
  condition: "baseline" | "timePressure",
  coherence: 0.10 | 0.25 | 0.40,
  direction: "left" | "right",
  response: "left" | "right" | "timeout",
  rt: 847,  // milliseconds from stimulus onset
  correct: true | false,
  timeout: false | true,
  timestamp: "2025-11-12T14:23:45.123Z"
}
```

### Participant-Level Data

```javascript
{
  participantId: "P_1699824738_x7k9m2",
  demographics: {
    age: 24,
    gender: "male" | "female" | "non-binary" | "prefer-not-to-say",
    handedness: "right" | "left" | "ambidextrous"
  },
  postSurvey: {
    impulsivity: 4,      // 1-7 scale
    attention: 6,        // 1-7 scale
    taskDifficulty: 5    // 1-7 scale
  },
  completionTime: "2025-11-12T14:35:12.456Z",
  duration: 12.5,  // minutes
  completed: true,
  consentedAt: "2025-11-12T14:23:12.123Z"
}
```

---

## 🔬 DDM Model Parameters

### Classical DDM

The Drift Diffusion Model has four main parameters:

1. **Drift Rate (v)**: Evidence accumulation rate
   - Higher coherence → higher drift rate
   - Expected range: 0.1 to 0.5
   - Units: evidence units per second

2. **Boundary Separation (a)**: Decision threshold
   - Distance between decision boundaries
   - Expected range: 1.0 to 3.0
   - Higher = more cautious (slower, more accurate)

3. **Non-Decision Time (Ter)**: Motor + perceptual delays
   - Time for encoding stimulus + executing response
   - Expected range: 200-400ms
   - Does not contribute to evidence accumulation

4. **Starting Point (z)**: Initial bias
   - Usually 0.5 (unbiased)
   - Fixed at a/2 in our implementation

### Adaptive Boundary Model

Extends classical DDM with time-dependent boundaries:

**Collapsing Boundary Function:**
```
a(t) = a_end + (a_start - a_end) * exp(-collapse_rate * t)
```

**Additional Parameters:**
- **a_start**: Initial boundary separation (wide)
- **a_end**: Final boundary separation (narrow)
- **collapse_rate**: Speed of boundary collapse
  - Higher = faster urgency signal
  - Expected range: 0.5 to 3.0

**Hypothesis**: Time pressure increases collapse_rate, leading to:
- Faster responses (lower RT)
- Reduced accuracy (more errors)
- Earlier boundary crossings

---

## 📈 Data Analysis Scripts

### Installation

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Required packages:
- `numpy` - Numerical computing
- `pandas` - Data manipulation
- `matplotlib` - Plotting
- `seaborn` - Statistical visualization
- `scipy` - Statistical functions
- `tqdm` - Progress bars
- `hddm` (optional) - Hierarchical Bayesian DDM

### Available Scripts

#### 1. `adaptive_ddm.py` - Adaptive Boundary Simulation

Simulates DDM with collapsing boundaries to model urgency signals.

```bash
python adaptive_ddm.py
```

**Outputs:**
- `adaptive_ddm_simulation.csv` - Simulated trial data
- `adaptive_ddm_summary.csv` - Summary statistics
- `adaptive_ddm_results.png` - Visualization of collapsing boundaries

**What it does:**
- Simulates 1500 trials across 3 coherence levels
- Implements exponential boundary collapse
- Compares baseline vs time pressure conditions
- Generates RT distributions and accuracy plots

**Runtime:** 5-10 minutes

---

#### 2. `simple_parameter_estimation.py` - Grid Search Estimation

Estimates DDM parameters using grid search (no HDDM required).

```bash
python simple_parameter_estimation.py
```

**Inputs:**
- Requires `ddm_data_for_analysis.csv` (exported from database)

**Outputs:**
- `estimated_parameters.csv` - Best-fit parameters
- `parameter_estimation_results.png` - Fit quality plots

**What it does:**
- Grid search over parameter space (v, a, ter)
- Minimizes difference between observed and simulated data
- Uses quantile-based objective function
- Fast and interpretable

**Runtime:** 10-15 minutes

**Parameters tested:**
- Drift rate (v): 0.05 to 0.50 (20 steps)
- Boundary (a): 0.5 to 3.0 (15 steps)
- Non-decision time (ter): 0.2 to 0.5 (10 steps)

---

#### 3. `parameter_recovery_validation.py` - Recovery Validation

Validates parameter estimation by testing if known parameters can be recovered.

```bash
python parameter_recovery_validation.py
```

**Outputs:**
- `parameter_recovery_results.csv` - True vs recovered parameters
- `parameter_recovery_validation.png` - Recovery quality plots

**What it does:**
- Generates data with known parameters
- Attempts to recover parameters using estimation method
- Plots true vs recovered for each parameter
- Calculates correlation and bias

**Runtime:** 15-20 minutes

**Validation metrics:**
- Correlation (r > 0.9 is good)
- Mean absolute error
- Bias (systematic over/under-estimation)

---

#### 4. `anayze_real_data.py` - Real Data Analysis

Analyzes actual experimental data from participants.

```bash
python anayze_real_data.py
```

**Inputs:**
- `ddm_data_for_analysis.csv`
- `ddm_participants.csv`

**Outputs:**
- `real_data_results.png` - RT distributions, accuracy plots
- `summary_statistics.csv` - Descriptive statistics

**What it does:**
- Loads real participant data
- Computes RT quantiles (10th, 30th, 50th, 70th, 90th)
- Analyzes accuracy by condition and coherence
- Checks for speed-accuracy tradeoff
- Tests for time pressure effects

**Runtime:** 2-3 minutes

**Analyses:**
- RT distributions by condition
- Accuracy by coherence level
- Speed-accuracy tradeoff
- Individual differences

---

#### 5. `compare_real_vs_simulation.py` - Model Comparison

Compares real data to DDM predictions.

```bash
python compare_real_vs_simulation.py
```

**Inputs:**
- `ddm_data_for_analysis.csv` (real data)
- `estimated_parameters.csv` (from parameter estimation)

**Outputs:**
- `real_vs_simulation_comparison.png` - Side-by-side comparison
- `model_fit_comparison.csv` - Goodness-of-fit metrics

**What it does:**
- Simulates data using estimated parameters
- Compares RT distributions (real vs model)
- Compares accuracy patterns
- Calculates fit quality (RMSE, χ²)

**Runtime:** 5-8 minutes

**Fit metrics:**
- RMSE (root mean squared error)
- Chi-square goodness of fit
- Kolmogorov-Smirnov test

---

#### 6. `comprehensive_figure.py` - Publication Figures

Generates publication-quality figures combining all analyses.

```bash
python comprehensive_figure.py
```

**Outputs:**
- `comprehensive_results_figure.png` - Multi-panel figure

**What it includes:**
- Panel A: RT distributions by condition
- Panel B: Accuracy by coherence
- Panel C: Speed-accuracy tradeoff
- Panel D: Model fit comparison
- Panel E: Parameter estimates with confidence intervals

**Runtime:** 3-5 minutes

---

#### 7. `quick_hddm.py` - Hierarchical Bayesian Estimation

Uses HDDM for hierarchical Bayesian parameter estimation (optional).

```bash
python quick_hddm.py
```

**Requirements:**
- Requires `hddm` package: `pip install hddm`
- May require additional dependencies (kabuki, pymc)

**Outputs:**
- `hddm_results.csv` - Posterior parameter estimates
- `hddm_traces.png` - MCMC trace plots
- `hddm_posteriors.png` - Parameter posterior distributions

**What it does:**
- Fits hierarchical DDM across all participants
- Estimates group-level and individual parameters
- Provides uncertainty estimates (credible intervals)
- Tests for condition differences

**Runtime:** 30-60 minutes (MCMC sampling)

**Note:** HDDM is more sophisticated but slower. Use for final publication-quality estimates.

---

#### 8. `emergency_ddm_simulation.py` - Quick Simulation

Fast DDM simulation for testing and demonstration.

```bash
python emergency_ddm_simulation.py
```

**Outputs:**
- `simulated_ddm_data.csv` - Simulated dataset
- `ddm_simulation_results.png` - Basic plots

**What it does:**
- Generates synthetic DDM data quickly
- Useful for testing analysis pipeline
- Demonstrates expected patterns

**Runtime:** 1-2 minutes

---

## 📊 Exporting Data from MongoDB

### Method 1: API Endpoint (Easiest)

Visit in browser or use curl:

```bash
# Export all data as CSV
curl http://localhost:5000/api/data/export > experiment_data.csv

# Get summary statistics
curl http://localhost:5000/api/data/stats
```

### Method 2: Node.js Export Script

```bash
# Install dependencies
npm install mongodb

# Run export script
node exact-export.js
```

**Outputs:**
- `ddm_participants.csv` - Participant demographics
- `ddm_all_trials.csv` - All trial data
- `ddm_data_for_analysis.csv` - Formatted for analysis scripts

### Method 3: MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `ddm-experiment` database
4. Export `participants` and `trials` collections as CSV

---

## 🔌 API Endpoints

### Participants

- `POST /api/participants/create` - Create new participant
  - Returns: `{ participantId }`

- `POST /api/participants/:id/demographics` - Submit demographics
  - Body: `{ age, gender, handedness }`

- `POST /api/participants/:id/complete` - Mark completed
  - Body: `{ postSurvey: { impulsivity, attention, taskDifficulty } }`

- `GET /api/participants/:id` - Get participant details

### Trials

- `POST /api/trials/submit` - Submit trial data (batch)
  - Body: `{ participantId, trials: [...] }`

- `GET /api/trials/:participantId` - Get all trials for participant

- `GET /api/trials/:participantId/stats` - Get statistics

### Data Export

- `GET /api/data/export` - Download CSV of all data
- `GET /api/data/stats` - Get experiment statistics
- `GET /api/data/participants` - Get all participants list

### Health

- `GET /api/health` - Server health check
  - Returns: `{ status: "ok", database: "connected" }`

---

## 🛠️ Database Management

### Clean Test Data

Use the cleanup script to remove test data before production:

```bash
cd backend
npm run clean-db
```

**Warning:** This deletes ALL participants and trials. Use with caution!

**Safer alternative:** Filter by date in your analysis:

```javascript
// In analysis script
const realData = allData.filter(trial =>
  new Date(trial.timestamp) > new Date('2025-12-01')
);
```

---

## 🚀 Deployment Guide

See `QUICK_DEPLOY.md` for step-by-step deployment instructions.

**Recommended stack:**
- **Frontend:** Vercel (free tier)
- **Backend:** Render (free tier)
- **Database:** MongoDB Atlas (free tier)

**Important environment variables:**

**Vercel (Frontend):**
```env
VITE_API_URL=https://your-backend.onrender.com
```

**Render (Backend):**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ddm-experiment?retryWrites=true
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Security notes:**
- NEVER put MongoDB credentials in frontend
- Use environment variables for all secrets
- Enable CORS only for your frontend domain
- Change default MongoDB password before deployment

---

## 🐛 Troubleshooting

### Backend Issues

**Backend won't start:**
```bash
# Check MongoDB connection
# Verify .env file exists
cat backend/.env

# Check if port is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

**Database connection failed:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0 for development)
- Ensure database name is included in URI: `/ddm-experiment`

### Frontend Issues

**Frontend won't connect to backend:**
```bash
# Check .env file
cat frontend/.env

# Should have:
# VITE_API_URL=http://localhost:5000
```

**CORS errors:**
- Backend must whitelist frontend URL in CORS_ORIGIN
- Check browser console for exact error
- Verify backend is running

### Experiment Issues

**Trials freezing mid-experiment:**
- Fixed in RandomDotMotion.jsx:147 (trialNumber in useEffect deps)
- Check browser console for errors
- Refresh page if using development server

**Data not saving:**
- Check browser Network tab for API call failures
- Data is auto-saved to localStorage as backup
- Check MongoDB connection in backend logs

**Poor performance / laggy dots:**
- Close other browser tabs
- Update graphics drivers
- Reduce NUM_DOTS in RandomDotMotion.jsx (line 10)

### Analysis Issues

**Python script errors:**
```bash
# Install all dependencies
pip install -r requirements.txt

# If HDDM fails (optional):
# It's ok to skip HDDM, use simple_parameter_estimation.py instead
```

**Missing data files:**
- Export data using `node exact-export.js`
- Or use API endpoint: `/api/data/export`
- Ensure CSV files are in project root

---

## 📱 Browser Compatibility

**Supported:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Not Supported:**
- Mobile browsers ❌ (by design - keyboard required)
- Internet Explorer ❌

---

## 🔒 Data Privacy & Ethics

- All data is **anonymous** (no PII collected)
- Random participant IDs generated
- Informed consent required before participation
- **IRB approval recommended** before data collection
- GDPR compliant (no personal data stored)
- Right to withdraw (participants can close browser anytime)

---

## 📚 Scientific Background

This experiment tests the **Adaptive Boundary Hypothesis** in decision-making:

### Classical Drift Diffusion Model (DDM)

- Assumes **fixed decision boundaries**
- Evidence accumulates until boundary is reached
- Parameters: drift rate (v), boundary (a), non-decision time (ter)

### Adaptive Boundary Model

- **Boundaries collapse over time** based on urgency
- Urgency signal increases as time passes
- Predicts faster responses under time pressure

### Hypothesis

**Time pressure lowers decision boundaries**, leading to:
1. ⬇️ Faster response times
2. ⬇️ Reduced accuracy
3. ⬆️ Increased speed-accuracy tradeoff

### Key Predictions

| Condition | Boundary | RT | Accuracy | SAT |
|-----------|----------|-------|----------|-----|
| Baseline | High (a ≈ 2.0) | Slow | High | Optimal |
| Time Pressure | Low (a ≈ 1.2) | Fast | Lower | Shifted |

---

## 📖 Citation

If you use this code for research, please cite:

```bibtex
@software{sahil2025ddm,
  author = {Sahil},
  title = {DDM Experiment: Testing Adaptive Decision Boundaries Under Time Pressure},
  year = {2025},
  institution = {Indian Institute of Technology},
  id = {2023122006}
}
```

---

## 📄 License

MIT License - Free to use for research and educational purposes.

---

## 🤝 Contributing

This is a research project. If you find bugs or have suggestions:

1. Open an issue on GitHub
2. Submit a pull request with description
3. Contact the researcher

---

## 📧 Contact

**Researcher:** Sahil (Roll Number: 2023122006)

For questions about:
- Experiment design
- Data analysis
- Technical issues
- Research collaboration

---

## ✅ Pre-Deployment Checklist

- [ ] Test complete experiment flow locally (all 90 trials)
- [ ] Verify practice trials show feedback
- [ ] Test baseline condition (40 trials, no time limit)
- [ ] Test time pressure condition (40 trials, 1s deadline)
- [ ] Verify data saves to MongoDB correctly
- [ ] Test CSV export functionality
- [ ] Check mobile warning displays on phones
- [ ] Test on Chrome, Firefox, and Safari
- [ ] Verify RT precision (use console logs)
- [ ] Test timeout functionality in time pressure
- [ ] Check consent form displays correctly
- [ ] Test error handling (disconnect network)
- [ ] Verify localStorage backup works
- [ ] Run analysis scripts on test data

---

## 🎯 Workflow: From Data Collection to Results

### Step 1: Data Collection

1. Deploy application (see `QUICK_DEPLOY.md`)
2. Share link with participants
3. Monitor progress: `http://your-backend/api/data/stats`
4. Target: 50 completed participants

### Step 2: Data Export

```bash
# Export from MongoDB
node exact-export.js

# Or use API
curl http://your-backend/api/data/export > ddm_data.csv
```

### Step 3: Data Analysis

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run analysis pipeline
python anayze_real_data.py                    # Step 1: Descriptive stats
python simple_parameter_estimation.py         # Step 2: Fit DDM
python parameter_recovery_validation.py       # Step 3: Validate method
python compare_real_vs_simulation.py          # Step 4: Model comparison
python comprehensive_figure.py                # Step 5: Publication figure

# Optional: Bayesian analysis
python quick_hddm.py                          # HDDM (slow but thorough)
```

### Step 4: Results Interpretation

**Check these outputs:**
- `summary_statistics.csv` - Descriptive statistics
- `estimated_parameters.csv` - DDM parameters
- `model_fit_comparison.csv` - Model goodness of fit
- `comprehensive_results_figure.png` - Main figure

**Key questions:**
1. Did RT decrease under time pressure? (expected: yes)
2. Did accuracy decrease under time pressure? (expected: yes)
3. Did boundary separation (a) decrease? (expected: yes)
4. Is there a speed-accuracy tradeoff? (expected: yes)
5. Does adaptive model fit better? (hypothesis test)

---

## 📊 Expected Results

### Typical Parameter Values

**Baseline Condition:**
- Drift rate (v): 0.25 - 0.35
- Boundary (a): 1.8 - 2.2
- Non-decision time (ter): 250 - 350ms

**Time Pressure Condition:**
- Drift rate (v): 0.25 - 0.35 (similar)
- Boundary (a): 1.0 - 1.5 (lower!)
- Non-decision time (ter): 250 - 350ms (similar)

### Behavioral Patterns

**Response Times:**
- Baseline: 800-1200ms (median)
- Time Pressure: 600-900ms (median)
- Difference: ~200-300ms faster

**Accuracy:**
- Baseline: 85-95% (high coherence)
- Time Pressure: 75-85% (high coherence)
- Difference: ~10% reduction

---

## 🔧 Model Weights & Parameters

### Pre-configured Parameters (in code)

**RDM Task:**
- `NUM_DOTS = 200`
- `DOT_RADIUS = 3`
- `APERTURE_RADIUS = 250`
- `DOT_SPEED = 2` pixels/frame
- `DOT_LIFETIME = 3` frames

**Trial Generation:**
- `COHERENCE_LEVELS = [0.10, 0.25, 0.40]`
- `MAX_CONSECUTIVE_SAME_DIRECTION = 3`
- Trial distribution: [13, 14, 13] per coherence

**Simulation Defaults (adaptive_ddm.py):**
- `v = 0.3` (drift rate)
- `a_start = 2.0` (initial boundary)
- `a_end = 1.0` (collapsed boundary)
- `collapse_rate = 2.0` (urgency signal)
- `ter = 0.3` (300ms non-decision time)

### Parameter Recovery Ground Truth

For validation, these parameters are used:
- `v_true = [0.2, 0.3, 0.4]` (by coherence)
- `a_true = 1.5`
- `ter_true = 0.3`

---

## 🚦 Reproducibility

All results can be reproduced by:

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd INCM_project-
   ```

2. **Install dependencies**
   ```bash
   # Node.js
   cd backend && npm install
   cd ../frontend && npm install

   # Python
   pip install -r requirements.txt
   ```

3. **Use provided data**
   - Real data: `ddm_data_for_analysis.csv`
   - Simulated data: Generated by scripts

4. **Run analysis pipeline**
   ```bash
   python anayze_real_data.py
   python simple_parameter_estimation.py
   python comprehensive_figure.py
   ```

5. **Compare outputs**
   - Check CSV files match expected format
   - Compare figures to provided PNGs
   - Verify parameter estimates are reasonable

---

**Built with:** React, Vite, Node.js, Express, MongoDB, Canvas API, Python, NumPy, Matplotlib

**Status:** ✅ Ready for deployment and data collection

**Last Updated:** December 2025
