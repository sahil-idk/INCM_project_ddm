# Executable Scripts Documentation

This document provides detailed information about all executable scripts in the project.

---

## 📦 Installation

### Node.js Scripts

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install

# Install root dependencies (for exact-export.js)
npm install
```

### Python Scripts

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or with virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🎯 Quick Start: Complete Analysis Pipeline

### Option 1: Run All Scripts Sequentially

```bash
# Make script executable
chmod +x run_analysis.sh

# Run complete pipeline
./run_analysis.sh
```

### Option 2: Manual Step-by-Step

```bash
# Step 1: Export data from MongoDB
node exact-export.js

# Step 2: Analyze real data
python anayze_real_data.py

# Step 3: Estimate DDM parameters
python simple_parameter_estimation.py

# Step 4: Validate parameter recovery
python parameter_recovery_validation.py

# Step 5: Compare model vs real data
python compare_real_vs_simulation.py

# Step 6: Generate publication figure
python comprehensive_figure.py

# Optional: Adaptive boundary simulation
python adaptive_ddm.py

# Optional: Bayesian estimation (slow)
python quick_hddm.py
```

---

## 📋 Node.js Scripts

### 1. `exact-export.js` - MongoDB Data Export

**Purpose:** Exports experimental data from MongoDB to CSV files

**Usage:**
```bash
node exact-export.js
```

**Requirements:**
- MongoDB connection (reads from environment or uses default)
- `mongodb` package installed

**Outputs:**
- `ddm_participants.csv` - Participant demographics and metadata
- `ddm_all_trials.csv` - All trial data with timestamps
- `ddm_data_for_analysis.csv` - Cleaned data for Python analysis

**Configuration:**
Edit the MongoDB URI in the script if needed:
```javascript
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'ddm-experiment';
```

**What it does:**
1. Connects to MongoDB database
2. Retrieves all participants and trials
3. Formats data for analysis
4. Exports to CSV files
5. Generates summary statistics

**Expected output:**
```
Connecting to MongoDB...
Connected successfully
Fetching participants...
Found 15 participants
Fetching trials...
Found 1200 trials
Exporting to CSV...
✓ ddm_participants.csv (15 rows)
✓ ddm_all_trials.csv (1200 rows)
✓ ddm_data_for_analysis.csv (1200 rows)
Done!
```

---

### 2. Backend Scripts

#### `npm run dev` (Backend)
**Location:** `backend/`

**Purpose:** Starts backend development server with hot reload

**Usage:**
```bash
cd backend
npm run dev
```

**What it does:**
- Starts Express server on port 5000
- Enables auto-restart on file changes (nodemon)
- Connects to MongoDB
- Serves API endpoints

---

#### `npm run start` (Backend)
**Location:** `backend/`

**Purpose:** Starts backend production server

**Usage:**
```bash
cd backend
npm run start
```

**Use case:** Production deployment on Render/Heroku

---

#### `npm run clean-db` (Backend)
**Location:** `backend/`

**Purpose:** Deletes ALL participants and trials from database

**Usage:**
```bash
cd backend
npm run clean-db
```

**Warning:** This is irreversible! Use only for testing.

**What it does:**
1. Connects to MongoDB
2. Shows count of participants and trials
3. Waits 5 seconds (gives you time to cancel with Ctrl+C)
4. Deletes all data
5. Confirms deletion

---

### 3. Frontend Scripts

#### `npm run dev` (Frontend)
**Location:** `frontend/`

**Purpose:** Starts frontend development server

**Usage:**
```bash
cd frontend
npm run dev
```

**What it does:**
- Starts Vite dev server on port 5173
- Enables hot module replacement (HMR)
- Opens browser automatically

---

#### `npm run build` (Frontend)
**Location:** `frontend/`

**Purpose:** Builds production-ready frontend

**Usage:**
```bash
cd frontend
npm run build
```

**Output:** `frontend/dist/` folder with optimized assets

**Use case:** Deployment to Vercel/Netlify

---

#### `npm run preview` (Frontend)
**Location:** `frontend/`

**Purpose:** Preview production build locally

**Usage:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🐍 Python Analysis Scripts

### 1. `anayze_real_data.py` - Real Data Analysis

**Purpose:** Analyzes actual experimental data from participants

**Usage:**
```bash
python anayze_real_data.py
```

**Inputs:**
- `ddm_data_for_analysis.csv` (required)
- `ddm_participants.csv` (optional, for demographics)

**Outputs:**
- `real_data_results.png` - Multi-panel figure
- `summary_statistics.csv` - Descriptive statistics
- Console output with summary

**What it analyzes:**
- RT distributions by condition
- Accuracy by coherence level
- Speed-accuracy tradeoff
- Timeout rates
- Individual participant variability

**Runtime:** 2-3 minutes

**Expected console output:**
```
Loading data...
Found 1200 trials from 15 participants
Baseline: 600 trials, Time Pressure: 600 trials

Summary Statistics:
Baseline - Mean RT: 892ms, Accuracy: 87.3%
Time Pressure - Mean RT: 678ms, Accuracy: 79.1%

Generating plots...
Saved: real_data_results.png
Saved: summary_statistics.csv
Done!
```

---

### 2. `simple_parameter_estimation.py` - DDM Parameter Estimation

**Purpose:** Estimates DDM parameters using grid search

**Usage:**
```bash
python simple_parameter_estimation.py
```

**Inputs:**
- `ddm_data_for_analysis.csv`

**Outputs:**
- `estimated_parameters.csv` - Best-fit parameters
- `parameter_estimation_results.png` - Fit quality plots

**What it does:**
1. Loads real data
2. Defines parameter grid (v, a, ter)
3. Simulates data for each parameter combination
4. Compares simulated vs real using quantile matching
5. Finds best-fit parameters
6. Visualizes fit quality

**Parameters searched:**
- Drift rate (v): 0.05 to 0.50 (20 steps)
- Boundary (a): 0.5 to 3.0 (15 steps)
- Non-decision time (ter): 0.2 to 0.5 (10 steps)

**Runtime:** 10-15 minutes (3000 parameter combinations)

**Expected output:**
```
Loading data...
Setting up parameter grid...
Testing 3000 parameter combinations...
Progress: 100%|████████████| 3000/3000 [12:34<00:00, 3.98it/s]

Best-fit parameters:
  Baseline: v=0.32, a=2.1, ter=0.29
  Time Pressure: v=0.31, a=1.4, ter=0.28

Fit quality (RMSE): 0.043
Saved: estimated_parameters.csv
Saved: parameter_estimation_results.png
```

---

### 3. `parameter_recovery_validation.py` - Parameter Recovery Test

**Purpose:** Validates that parameter estimation method works correctly

**Usage:**
```bash
python parameter_recovery_validation.py
```

**Inputs:**
- None (generates synthetic data with known parameters)

**Outputs:**
- `parameter_recovery_results.csv` - True vs recovered
- `parameter_recovery_validation.png` - Recovery plots

**What it does:**
1. Generates synthetic data with known parameters
2. Runs parameter estimation on synthetic data
3. Compares recovered vs true parameters
4. Plots correlation and bias

**Validation metrics:**
- Pearson correlation (r > 0.9 is good)
- Mean absolute error
- Bias (systematic over/under-estimation)

**Runtime:** 15-20 minutes

**Expected output:**
```
Generating synthetic data with known parameters...
True parameters: v=0.3, a=1.8, ter=0.3

Running parameter estimation...
Progress: 100%|████████████| 3000/3000 [14:21<00:00, 3.48it/s]

Recovered parameters: v=0.29, a=1.82, ter=0.31
Correlation: r=0.94, p<0.001
MAE: 0.021

✓ Parameter recovery successful!
Saved: parameter_recovery_results.csv
Saved: parameter_recovery_validation.png
```

---

### 4. `compare_real_vs_simulation.py` - Model Comparison

**Purpose:** Compares real data to DDM predictions

**Usage:**
```bash
python compare_real_vs_simulation.py
```

**Inputs:**
- `ddm_data_for_analysis.csv` (real data)
- `estimated_parameters.csv` (from parameter estimation)

**Outputs:**
- `real_vs_simulation_comparison.png` - Side-by-side plots
- `model_fit_comparison.csv` - Goodness-of-fit metrics

**What it does:**
1. Loads real data and estimated parameters
2. Simulates data using estimated parameters
3. Compares RT distributions
4. Compares accuracy patterns
5. Calculates fit quality metrics

**Fit metrics:**
- RMSE (root mean squared error)
- Chi-square test
- Kolmogorov-Smirnov test
- R² (variance explained)

**Runtime:** 5-8 minutes

**Expected output:**
```
Loading real data and parameters...
Simulating data with estimated parameters...
Simulating 1200 trials...

Comparing real vs simulation...
RMSE: 0.038
χ² = 12.4, p=0.26 (good fit!)
K-S test: D=0.08, p=0.45
R² = 0.87

Saved: real_vs_simulation_comparison.png
Saved: model_fit_comparison.csv
```

---

### 5. `comprehensive_figure.py` - Publication Figure

**Purpose:** Generates multi-panel publication-quality figure

**Usage:**
```bash
python comprehensive_figure.py
```

**Inputs:**
- `ddm_data_for_analysis.csv`
- `estimated_parameters.csv`
- `summary_statistics.csv`

**Outputs:**
- `comprehensive_results_figure.png` - High-resolution multi-panel figure

**Figure panels:**
- **Panel A:** RT distributions (baseline vs time pressure)
- **Panel B:** Accuracy by coherence level
- **Panel C:** Speed-accuracy tradeoff
- **Panel D:** Model fit comparison
- **Panel E:** Parameter estimates with error bars
- **Panel F:** Individual differences

**Runtime:** 3-5 minutes

**Figure specs:**
- Format: PNG, 300 DPI
- Size: 12" × 8"
- Font: Arial 10pt
- Color scheme: Colorblind-friendly

---

### 6. `adaptive_ddm.py` - Adaptive Boundary Simulation

**Purpose:** Simulates DDM with collapsing boundaries

**Usage:**
```bash
python adaptive_ddm.py
```

**Inputs:**
- None (simulation with predefined parameters)

**Outputs:**
- `adaptive_ddm_simulation.csv` - Simulated trial data
- `adaptive_ddm_summary.csv` - Summary statistics
- `adaptive_ddm_results.png` - Visualization

**What it simulates:**
- Baseline: Fixed boundaries (a = 2.0)
- Time Pressure: Collapsing boundaries (a_start=2.0 → a_end=1.0)
- 1500 trials total
- 3 coherence levels

**Model equation:**
```
a(t) = a_end + (a_start - a_end) * exp(-collapse_rate * t)
```

**Runtime:** 5-10 minutes

**Expected output:**
```
ADAPTIVE DDM - COLLAPSING BOUNDARIES

Simulating baseline (fixed boundaries)...
Simulating 750 trials...
Mean RT: 891ms, Accuracy: 88.2%

Simulating time pressure (collapsing boundaries)...
Simulating 750 trials...
Mean RT: 654ms, Accuracy: 78.5%

Time pressure effect:
  ΔRT = -237ms (26% faster)
  ΔAcc = -9.7% (reduced accuracy)
  Boundary change: 2.0 → 1.3 (avg final)

Saved: adaptive_ddm_simulation.csv
Saved: adaptive_ddm_summary.csv
Saved: adaptive_ddm_results.png
```

---

### 7. `quick_hddm.py` - Hierarchical Bayesian DDM

**Purpose:** Estimates parameters using hierarchical Bayesian methods

**Usage:**
```bash
python quick_hddm.py
```

**Requirements:**
```bash
pip install hddm kabuki pymc
# Note: May require additional system dependencies
```

**Inputs:**
- `ddm_data_for_analysis.csv`

**Outputs:**
- `hddm_results.csv` - Posterior estimates
- `hddm_traces.png` - MCMC trace plots
- `hddm_posteriors.png` - Posterior distributions

**What it does:**
1. Loads and formats data for HDDM
2. Builds hierarchical model
3. Runs MCMC sampling (5000 samples)
4. Checks convergence (Gelman-Rubin)
5. Extracts posterior estimates
6. Tests for condition effects

**Runtime:** 30-60 minutes (MCMC sampling is slow)

**Expected output:**
```
Loading data...
Building hierarchical DDM...
Running MCMC sampling...
Sample: 100%|████| 5000/5000 [45:23<00:00, 1.84it/s]

Convergence check:
  v: R̂ = 1.01 ✓
  a: R̂ = 1.02 ✓
  t: R̂ = 1.00 ✓

Posterior estimates (95% CI):
  Baseline: v=0.31 [0.28, 0.34], a=2.08 [1.92, 2.24]
  Time Pressure: v=0.30 [0.27, 0.33], a=1.42 [1.28, 1.56]

Condition effect on boundary:
  Δa = -0.66, 95% CI [-0.82, -0.50]
  p < 0.001 (significant!)

Saved: hddm_results.csv
Saved: hddm_traces.png
Saved: hddm_posteriors.png
```

**Note:** HDDM is optional but provides:
- Hierarchical modeling across participants
- Uncertainty estimates (Bayesian credible intervals)
- Statistical tests for condition effects
- Better handling of small sample sizes

---

### 8. `emergency_ddm_simulation.py` - Quick Simulation

**Purpose:** Fast DDM simulation for testing

**Usage:**
```bash
python emergency_ddm_simulation.py
```

**Inputs:**
- None (simulation)

**Outputs:**
- `simulated_ddm_data.csv`
- `ddm_simulation_results.png`

**What it does:**
- Generates 1000 trials quickly
- Uses standard DDM parameters
- Creates basic plots

**Runtime:** 1-2 minutes

**Use cases:**
- Testing analysis pipeline
- Demonstrating expected patterns
- Quick prototyping

---

## 🔧 Helper Scripts

### `run_analysis.sh` - Complete Analysis Pipeline

**Purpose:** Runs all analysis scripts in correct order

**Usage:**
```bash
chmod +x run_analysis.sh
./run_analysis.sh
```

**What it does:**
1. Checks for required data files
2. Runs data export
3. Runs all analysis scripts sequentially
4. Generates all figures and tables
5. Creates summary report

**Expected runtime:** 30-40 minutes total

---

## 📊 Output Files Summary

| Script | Output Files | Description |
|--------|--------------|-------------|
| `exact-export.js` | `ddm_participants.csv`<br>`ddm_all_trials.csv`<br>`ddm_data_for_analysis.csv` | Exported data from MongoDB |
| `anayze_real_data.py` | `real_data_results.png`<br>`summary_statistics.csv` | Descriptive statistics and plots |
| `simple_parameter_estimation.py` | `estimated_parameters.csv`<br>`parameter_estimation_results.png` | DDM parameters and fit |
| `parameter_recovery_validation.py` | `parameter_recovery_results.csv`<br>`parameter_recovery_validation.png` | Validation of estimation method |
| `compare_real_vs_simulation.py` | `real_vs_simulation_comparison.png`<br>`model_fit_comparison.csv` | Model vs data comparison |
| `comprehensive_figure.py` | `comprehensive_results_figure.png` | Publication figure |
| `adaptive_ddm.py` | `adaptive_ddm_simulation.csv`<br>`adaptive_ddm_summary.csv`<br>`adaptive_ddm_results.png` | Adaptive boundary simulation |
| `quick_hddm.py` | `hddm_results.csv`<br>`hddm_traces.png`<br>`hddm_posteriors.png` | Bayesian estimates |
| `emergency_ddm_simulation.py` | `simulated_ddm_data.csv`<br>`ddm_simulation_results.png` | Quick simulation |

---

## 🐛 Troubleshooting

### Python Import Errors

```bash
# ModuleNotFoundError: No module named 'numpy'
pip install -r requirements.txt

# If using virtual environment
source venv/bin/activate  # Activate first
pip install -r requirements.txt
```

### HDDM Installation Issues

HDDM can be complex to install. If it fails:

```bash
# Option 1: Skip HDDM (use simple_parameter_estimation.py instead)
# Comment out hddm in requirements.txt

# Option 2: Install dependencies
# On Ubuntu/Debian:
sudo apt-get install python3-dev gfortran libopenblas-dev

# On macOS:
brew install gcc openblas

# Then install HDDM
pip install hddm
```

### MongoDB Connection Errors

```bash
# For exact-export.js
# Check MongoDB is running
mongod --version

# Or update connection string in script
# Edit exact-export.js, line 4:
const uri = 'mongodb://localhost:27017';  # Change this
```

### Missing Data Files

```bash
# Export data first
node exact-export.js

# Or download from API
curl http://your-backend.com/api/data/export > ddm_data_for_analysis.csv
```

### Script Permission Errors

```bash
# Make scripts executable
chmod +x run_analysis.sh
chmod +x *.py  # If needed
```

---

## 📚 References

**DDM Theory:**
- Ratcliff & McKoon (2008). The Diffusion Decision Model
- Bogacz et al. (2006). Physics of optimal decision making

**Analysis Methods:**
- Wiecki et al. (2013). HDDM: Hierarchical Bayesian estimation
- Ratcliff & Tuerlinckx (2002). Estimating parameters of the diffusion model

**Software:**
- HDDM: http://ski.clps.brown.edu/hddm_docs/
- NumPy: https://numpy.org/
- Pandas: https://pandas.pydata.org/
- Matplotlib: https://matplotlib.org/

---

**Last Updated:** December 2025
