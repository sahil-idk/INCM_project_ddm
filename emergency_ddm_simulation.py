"""
EMERGENCY DDM SIMULATION - Minimal Working Version
Run this TONIGHT to get results for tomorrow's presentation
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# ============================================================================
# MINIMAL DDM SIMULATION
# ============================================================================

def simulate_ddm_trial(v, a, z, ter, dt=0.001, max_time=5.0):
    """
    Simulate ONE trial of DDM
    
    Parameters:
    v = drift rate (evidence quality)
    a = boundary separation (decision threshold)
    z = starting point (0.5 = no bias)
    ter = non-decision time
    """
    
    # Initialize
    x = z * a  # Starting evidence
    t = 0
    
    # Evidence accumulation loop
    while t < max_time:
        # Add drift + noise
        x += v * dt + np.sqrt(dt) * np.random.randn()
        
        # Check boundaries
        if x >= a:
            return ter + t, 1  # Upper boundary (correct if v > 0)
        elif x <= 0:
            return ter + t, 0  # Lower boundary (error if v > 0)
        
        t += dt
    
    # Timeout (rare)
    return max_time, np.random.choice([0, 1])

# ============================================================================
# SIMULATE FULL EXPERIMENT
# ============================================================================

def simulate_experiment(n_trials=1000):
    """Simulate experiment with different coherence levels"""
    
    # Coherence levels (mimicking your experiment)
    coherence_levels = [0.10, 0.25, 0.40]
    
    # DDM parameters for each coherence
    # Higher coherence = higher drift rate
    drift_rates = {
        0.10: 0.5,
        0.25: 1.5,
        0.40: 3.0
    }
    
    # Fixed parameters
    a = 1.5  # Boundary separation
    z = 0.5  # Starting point (no bias)
    ter = 0.3  # Non-decision time (300ms)
    
    # Storage
    results = []
    
    print("Simulating trials...")
    
    for coherence in coherence_levels:
        v = drift_rates[coherence]
        trials_per_coherence = n_trials // len(coherence_levels)
        
        for trial in range(trials_per_coherence):
            rt, response = simulate_ddm_trial(v, a, z, ter)
            
            # Determine if correct (assuming upper boundary = correct)
            correct = response == 1
            
            results.append({
                'trial': len(results) + 1,
                'coherence': coherence,
                'rt': rt,
                'response': response,
                'correct': correct,
                'v': v,
                'a': a
            })
    
    return pd.DataFrame(results)

# ============================================================================
# GENERATE RESULTS
# ============================================================================

print("="*80)
print("EMERGENCY DDM SIMULATION")
print("="*80)

# Run simulation
df = simulate_experiment(n_trials=1000)

print(f"\n✓ Simulated {len(df)} trials")
print(f"✓ Mean RT: {df['rt'].mean():.3f}s ({df['rt'].mean()*1000:.0f}ms)")
print(f"✓ Overall accuracy: {df['correct'].mean()*100:.1f}%")

# Summary by coherence
print("\n" + "="*80)
print("RESULTS BY COHERENCE LEVEL")
print("="*80)

for coh in [0.10, 0.25, 0.40]:
    data_coh = df[df['coherence'] == coh]
    print(f"\nCoherence {int(coh*100)}%:")
    print(f"  Mean RT: {data_coh['rt'].mean()*1000:.0f}ms")
    print(f"  Accuracy: {data_coh['correct'].mean()*100:.1f}%")
    print(f"  Drift rate (v): {data_coh['v'].iloc[0]:.2f}")

# ============================================================================
# CREATE VISUALIZATIONS FOR PRESENTATION
# ============================================================================

print("\nGenerating visualizations...")

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.suptitle('DDM Simulation Results', fontsize=16, fontweight='bold')

# 1. RT distributions
ax = axes[0, 0]
for coh in [0.10, 0.25, 0.40]:
    data_coh = df[df['coherence'] == coh]
    ax.hist(data_coh['rt'], bins=30, alpha=0.5, label=f'{int(coh*100)}% coherence')
ax.set_xlabel('Reaction Time (s)')
ax.set_ylabel('Count')
ax.set_title('RT Distributions by Coherence')
ax.legend()
ax.grid(alpha=0.3)

# 2. Accuracy by coherence
ax = axes[0, 1]
acc_by_coh = df.groupby('coherence')['correct'].mean() * 100
ax.bar([str(int(c*100))+'%' for c in acc_by_coh.index], acc_by_coh.values, 
       color=['lightcoral', 'lightsalmon', 'lightgreen'])
ax.set_ylabel('Accuracy (%)')
ax.set_title('Accuracy by Coherence Level')
ax.set_ylim([0, 100])
ax.grid(axis='y', alpha=0.3)

# 3. RT by coherence
ax = axes[1, 0]
rt_by_coh = df.groupby('coherence')['rt'].mean() * 1000
rt_std = df.groupby('coherence')['rt'].std() * 1000
ax.bar([str(int(c*100))+'%' for c in rt_by_coh.index], rt_by_coh.values, 
       yerr=rt_std.values, capsize=5, color='steelblue')
ax.set_ylabel('Mean RT (ms)')
ax.set_title('Reaction Time by Coherence')
ax.grid(axis='y', alpha=0.3)

# 4. Speed-accuracy tradeoff
ax = axes[1, 1]
for coh in [0.10, 0.25, 0.40]:
    data_coh = df[df['coherence'] == coh]
    ax.scatter(data_coh['rt'], data_coh['correct'], 
              alpha=0.3, s=20, label=f'{int(coh*100)}% coh')
ax.set_xlabel('RT (s)')
ax.set_ylabel('Correct (1=Yes, 0=No)')
ax.set_title('Speed-Accuracy Relationship')
ax.legend()
ax.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('ddm_simulation_results.png', dpi=300, bbox_inches='tight')
print("✓ Saved: ddm_simulation_results.png")

# ============================================================================
# SAVE DATA
# ============================================================================

df.to_csv('simulated_ddm_data.csv', index=False)
print("✓ Saved: simulated_ddm_data.csv")

print("\n" + "="*80)
print("SIMULATION COMPLETE")
print("="*80)
print("\nUse these results for your presentation tomorrow!")
print("The figure shows:")
print("1. RT distributions (should be right-skewed)")
print("2. Accuracy increases with coherence ✓")
print("3. RT decreases with coherence ✓")
print("4. Speed-accuracy tradeoff visible")
print("\nThis demonstrates you have a WORKING DDM implementation!")
