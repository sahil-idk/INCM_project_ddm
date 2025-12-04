#!/bin/bash

# DDM Experiment - Complete Analysis Pipeline
# This script runs all analysis steps in the correct order
# Usage: ./run_analysis.sh

echo "=========================================="
echo "DDM EXPERIMENT - ANALYSIS PIPELINE"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python is not installed${NC}"
    exit 1
fi

# Use python3 if available, otherwise python
if command -v python3 &> /dev/null; then
    PYTHON=python3
else
    PYTHON=python
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python found: $($PYTHON --version)${NC}"
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Check if MongoDB data needs to be exported
if [ ! -f "ddm_data_for_analysis.csv" ]; then
    echo -e "${YELLOW}Data file not found. Running data export...${NC}"
    echo ""

    # Check if mongodb package is installed
    if [ ! -d "node_modules/mongodb" ]; then
        echo "Installing mongodb package..."
        npm install mongodb
    fi

    # Run export script
    echo "Exporting data from MongoDB..."
    node exact-export.js

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Data export failed${NC}"
        echo "Please check your MongoDB connection and try again"
        exit 1
    fi

    echo ""
else
    echo -e "${GREEN}✓ Data file found${NC}"
    echo ""
fi

# Check if Python dependencies are installed
echo "Checking Python dependencies..."
$PYTHON -c "import numpy, pandas, matplotlib, scipy, seaborn, tqdm" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip install -r requirements.txt

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install Python dependencies${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Python dependencies OK${NC}"
echo ""

# Create output directory for organized results
mkdir -p analysis_results
echo -e "${GREEN}✓ Created analysis_results/ directory${NC}"
echo ""

# Step 1: Analyze real data
echo "=========================================="
echo "STEP 1: Analyzing Real Data"
echo "=========================================="
$PYTHON anayze_real_data.py
if [ $? -ne 0 ]; then
    echo -e "${RED}Error in real data analysis${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Real data analysis complete${NC}"
echo ""

# Step 2: Estimate parameters
echo "=========================================="
echo "STEP 2: Estimating DDM Parameters"
echo "=========================================="
echo "This may take 10-15 minutes..."
$PYTHON simple_parameter_estimation.py
if [ $? -ne 0 ]; then
    echo -e "${RED}Error in parameter estimation${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Parameter estimation complete${NC}"
echo ""

# Step 3: Validate parameter recovery
echo "=========================================="
echo "STEP 3: Validating Parameter Recovery"
echo "=========================================="
echo "This may take 15-20 minutes..."
$PYTHON parameter_recovery_validation.py
if [ $? -ne 0 ]; then
    echo -e "${RED}Error in parameter recovery validation${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Parameter recovery validation complete${NC}"
echo ""

# Step 4: Compare real vs simulation
echo "=========================================="
echo "STEP 4: Comparing Real vs Simulation"
echo "=========================================="
$PYTHON compare_real_vs_simulation.py
if [ $? -ne 0 ]; then
    echo -e "${RED}Error in model comparison${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Model comparison complete${NC}"
echo ""

# Step 5: Generate comprehensive figure
echo "=========================================="
echo "STEP 5: Generating Publication Figure"
echo "=========================================="
$PYTHON comprehensive_figure.py
if [ $? -ne 0 ]; then
    echo -e "${RED}Error generating comprehensive figure${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Publication figure generated${NC}"
echo ""

# Optional: Adaptive DDM simulation
echo "=========================================="
echo "OPTIONAL: Running Adaptive DDM Simulation"
echo "=========================================="
$PYTHON adaptive_ddm.py
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Adaptive DDM simulation failed (non-critical)${NC}"
else
    echo -e "${GREEN}✓ Adaptive DDM simulation complete${NC}"
fi
echo ""

# Move results to organized directory
echo "=========================================="
echo "Organizing Results"
echo "=========================================="
mv *.csv analysis_results/ 2>/dev/null
mv *.png analysis_results/ 2>/dev/null
echo -e "${GREEN}✓ Results moved to analysis_results/${NC}"
echo ""

# Generate summary report
echo "=========================================="
echo "ANALYSIS COMPLETE!"
echo "=========================================="
echo ""
echo "Results saved to: analysis_results/"
echo ""
echo "Key outputs:"
echo "  • real_data_results.png - Descriptive statistics"
echo "  • estimated_parameters.csv - DDM parameters"
echo "  • parameter_estimation_results.png - Fit quality"
echo "  • parameter_recovery_validation.png - Method validation"
echo "  • real_vs_simulation_comparison.png - Model fit"
echo "  • comprehensive_results_figure.png - Publication figure"
echo "  • summary_statistics.csv - Summary stats"
echo ""
echo "To view results:"
echo "  cd analysis_results"
echo "  open *.png  # macOS"
echo "  xdg-open *.png  # Linux"
echo "  start *.png  # Windows"
echo ""

# Display parameter estimates if available
if [ -f "analysis_results/estimated_parameters.csv" ]; then
    echo "=========================================="
    echo "ESTIMATED PARAMETERS"
    echo "=========================================="
    cat analysis_results/estimated_parameters.csv
    echo ""
fi

# Display summary statistics if available
if [ -f "analysis_results/summary_statistics.csv" ]; then
    echo "=========================================="
    echo "SUMMARY STATISTICS"
    echo "=========================================="
    head -20 analysis_results/summary_statistics.csv
    echo ""
fi

echo -e "${GREEN}✓ All done! Check the analysis_results/ folder for outputs.${NC}"
echo ""
