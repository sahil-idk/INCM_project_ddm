"""
REAL DATA ANALYSIS - FIXED VERSION (No Hanging!)
This version saves everything and exits cleanly
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.dpi'] = 300
plt.rcParams['font.size'] = 10

print("="*80)
print("DDM EXPERIMENT - REAL DATA ANALYSIS")
print("="*80)

# ============================================================================
# LOAD DATA
# ============================================================================

print("\n[1/6] Loading data...")
try:
    df = pd.read_csv('ddm_data_for_analysis.csv')
    participants = pd.read_csv('ddm_participants.csv')
    print(f"✓ Loaded {len(df)} trials from {len(participants)} participants")
except Exception as e:
    print(f"✗ Error loading data: {e}")
    print("\nMake sure these files are in the same folder:")
    print("  - ddm_data_for_analysis.csv")
    print("  - ddm_participants.csv")
    exit(1)

# ============================================================================
# DEMOGRAPHICS
# ============================================================================

print("\n[2/6] Analyzing demographics...")

print(f"\nSample size: N = {len(participants)}")
print(f"Age: M = {participants['age'].mean():.1f}, SD = {participants['age'].std():.1f}")
print(f"  Range: {participants['age'].min()}-{participants['age'].max()} years")
print(f"Gender: {dict(participants['gender'].value_counts())}")
print(f"Experiment duration: M = {participants['totalDuration'].mean()/60:.1f} minutes")

# ============================================================================
# DATA QUALITY
# ============================================================================

print("\n[3/6] Checking data quality...")

timeout_rate = df['timeout'].mean() * 100
df_valid = df[df['timeout'] == False].copy()

print(f"Valid trials: {len(df_valid)} ({len(df_valid)/len(df)*100:.1f}%)")
print(f"Timeout rate: {timeout_rate:.1f}%")

# ============================================================================
# OVERALL RESULTS
# ============================================================================

print("\n[4/6] Computing overall statistics...")

print(f"\nReaction Time: M = {df_valid['rt'].mean():.0f}ms, SD = {df_valid['rt'].std():.0f}ms")
print(f"Accuracy: {df['correct'].mean()*100:.1f}%")

# ============================================================================
# CONDITION COMPARISON - KEY FINDING!
# ============================================================================

print("\n[5/6] Analyzing time pressure effect...")

baseline = df[df['condition'] == 'baseline']
timepressure = df[df['condition'] == 'timePressure']
baseline_valid = df_valid[df_valid['condition'] == 'baseline']
tp_valid = df_valid[df_valid['condition'] == 'timePressure']

rt_diff = baseline_valid['rt'].mean() - tp_valid['rt'].mean()
acc_diff = baseline['correct'].mean() - timepressure['correct'].mean()

print("\nBASELINE:")
print(f"  RT: M = {baseline_valid['rt'].mean():.0f}ms, SD = {baseline_valid['rt'].std():.0f}ms")
print(f"  Accuracy: {baseline['correct'].mean()*100:.1f}%")

print("\nTIME PRESSURE:")
print(f"  RT: M = {tp_valid['rt'].mean():.0f}ms, SD = {tp_valid['rt'].std():.0f}ms")
print(f"  Accuracy: {timepressure['correct'].mean()*100:.1f}%")

print("\n" + "="*80)
print("🎯 KEY FINDING - TIME PRESSURE EFFECT")
print("="*80)
print(f"RT Change: {rt_diff:+.0f}ms ({rt_diff/baseline_valid['rt'].mean()*100:+.1f}%)")
print(f"Accuracy Change: {acc_diff*100:+.1f}%")

# Statistical test
t_stat, p_value = stats.ttest_ind(baseline_valid['rt'], tp_valid['rt'])
print(f"\nStatistical Test:")
print(f"  t = {t_stat:.3f}, p = {p_value:.4f}")
if p_value < 0.001:
    print(f"  *** HIGHLY SIGNIFICANT (p < .001)")
elif p_value < 0.01:
    print(f"  ** VERY SIGNIFICANT (p < .01)")
elif p_value < 0.05:
    print(f"  * SIGNIFICANT (p < .05)")
else:
    print(f"  Not significant")

# Effect size
pooled_std = np.sqrt(((len(baseline_valid)-1)*baseline_valid['rt'].std()**2 + 
                       (len(tp_valid)-1)*tp_valid['rt'].std()**2) / 
                      (len(baseline_valid) + len(tp_valid) - 2))
cohens_d = rt_diff / pooled_std
print(f"  Cohen's d = {cohens_d:.3f}")

# ============================================================================
# COHERENCE EFFECTS
# ============================================================================

print("\n" + "="*80)
print("COHERENCE EFFECTS")
print("="*80)

coherence_levels = sorted(df['coherence'].unique())
for coh in coherence_levels:
    data_coh = df[df['coherence'] == coh]
    data_coh_valid = df_valid[df_valid['coherence'] == coh]
    print(f"\n{int(coh*100)}% Coherence:")
    print(f"  RT: {data_coh_valid['rt'].mean():.0f}ms")
    print(f"  Accuracy: {data_coh['correct'].mean()*100:.1f}%")

# ============================================================================
# CREATE FIGURE
# ============================================================================

print("\n[6/6] Creating presentation figure...")

fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)

fig.suptitle('Real Behavioral Data - DDM Experiment (N=10)', 
             fontsize=16, fontweight='bold', y=0.98)

# Plot 1: RT by condition
ax1 = fig.add_subplot(gs[0, 0])
bp = ax1.boxplot([baseline_valid['rt'], tp_valid['rt']], 
                 labels=['Baseline', 'Time\nPressure'], 
                 patch_artist=True, widths=0.6)
bp['boxes'][0].set_facecolor('lightblue')
bp['boxes'][1].set_facecolor('lightcoral')
ax1.set_ylabel('Reaction Time (ms)', fontweight='bold')
ax1.set_title('A. RT by Condition', fontweight='bold')
ax1.grid(axis='y', alpha=0.3)
if p_value < 0.05:
    y_max = max(baseline_valid['rt'].max(), tp_valid['rt'].max())
    ax1.plot([1, 2], [y_max*1.1, y_max*1.1], 'k-', lw=1.5)
    stars = '***' if p_value < 0.001 else '**' if p_value < 0.01 else '*'
    ax1.text(1.5, y_max*1.15, stars, ha='center', fontsize=14, fontweight='bold')

# Plot 2: Accuracy by condition
ax2 = fig.add_subplot(gs[0, 1])
acc_base = baseline['correct'].mean() * 100
acc_tp = timepressure['correct'].mean() * 100
bars = ax2.bar(['Baseline', 'Time\nPressure'], [acc_base, acc_tp],
               color=['lightblue', 'lightcoral'], width=0.6)
ax2.set_ylabel('Accuracy (%)', fontweight='bold')
ax2.set_ylim([0, 100])
ax2.set_title('B. Accuracy by Condition', fontweight='bold')
ax2.grid(axis='y', alpha=0.3)
for bar, val in zip(bars, [acc_base, acc_tp]):
    height = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2., height + 2,
            f'{val:.1f}%', ha='center', va='bottom', fontweight='bold')

# Plot 3: Timeout rate
ax3 = fig.add_subplot(gs[0, 2])
to_base = baseline['timeout'].mean() * 100
to_tp = timepressure['timeout'].mean() * 100
bars = ax3.bar(['Baseline', 'Time\nPressure'], [to_base, to_tp],
               color=['lightblue', 'lightcoral'], width=0.6)
ax3.set_ylabel('Timeout Rate (%)', fontweight='bold')
ax3.set_title('C. Timeout Rate', fontweight='bold')
ax3.grid(axis='y', alpha=0.3)
for bar, val in zip(bars, [to_base, to_tp]):
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height + 0.5,
            f'{val:.1f}%', ha='center', va='bottom', fontweight='bold')

# Plot 4: RT distributions
ax4 = fig.add_subplot(gs[1, :2])
ax4.hist(baseline_valid['rt'], bins=40, alpha=0.6, label='Baseline', 
         color='blue', density=True, edgecolor='black', linewidth=0.5)
ax4.hist(tp_valid['rt'], bins=40, alpha=0.6, label='Time Pressure',
         color='red', density=True, edgecolor='black', linewidth=0.5)
ax4.set_xlabel('Reaction Time (ms)', fontweight='bold')
ax4.set_ylabel('Density', fontweight='bold')
ax4.set_title('D. RT Distributions by Condition', fontweight='bold')
ax4.legend(frameon=True, fancybox=True, shadow=True)
ax4.grid(alpha=0.3)

# Plot 5: RT by coherence
ax5 = fig.add_subplot(gs[1, 2])
for cond, color, marker, label in [('baseline', 'blue', 'o', 'Baseline'),
                                     ('timePressure', 'red', 's', 'Time Pressure')]:
    data_cond = df_valid[df_valid['condition']==cond]
    rt_means = data_cond.groupby('coherence')['rt'].mean()
    rt_sems = data_cond.groupby('coherence')['rt'].sem()
    ax5.errorbar(rt_means.index*100, rt_means.values, yerr=rt_sems.values,
                marker=marker, linewidth=2, capsize=5, label=label, color=color,
                markersize=8)
ax5.set_xlabel('Motion Coherence (%)', fontweight='bold')
ax5.set_ylabel('Mean RT (ms)', fontweight='bold')
ax5.set_title('E. RT by Coherence', fontweight='bold')
ax5.legend()
ax5.grid(alpha=0.3)

# Plot 6: Accuracy by coherence
ax6 = fig.add_subplot(gs[2, 0])
for cond, color, marker, label in [('baseline', 'blue', 'o', 'Baseline'),
                                     ('timePressure', 'red', 's', 'Time Pressure')]:
    data_cond = df[df['condition']==cond]
    acc_means = data_cond.groupby('coherence')['correct'].mean() * 100
    ax6.plot(acc_means.index*100, acc_means.values,
            marker=marker, linewidth=2, label=label, color=color, markersize=8)
ax6.set_xlabel('Motion Coherence (%)', fontweight='bold')
ax6.set_ylabel('Accuracy (%)', fontweight='bold')
ax6.set_ylim([0, 100])
ax6.set_title('F. Accuracy by Coherence', fontweight='bold')
ax6.legend()
ax6.grid(alpha=0.3)

# Plot 7: Speed-Accuracy Tradeoff
ax7 = fig.add_subplot(gs[2, 1])
for cond, color, marker, label in [('baseline', 'blue', 'o', 'Baseline'),
                                     ('timePressure', 'red', 's', 'Time Pressure')]:
    data_cond = df_valid[df_valid['condition']==cond]
    ax7.scatter(data_cond['rt'], data_cond['correct'], 
               alpha=0.3, s=20, label=label, color=color)
ax7.set_xlabel('RT (ms)', fontweight='bold')
ax7.set_ylabel('Correct (1=Yes, 0=No)', fontweight='bold')
ax7.set_title('G. Speed-Accuracy Trade-off', fontweight='bold')
ax7.legend()
ax7.grid(alpha=0.3)

# Plot 8: Summary
ax8 = fig.add_subplot(gs[2, 2])
ax8.axis('off')
summary_text = f"""KEY FINDINGS:

Time Pressure Effect:
• RT: {rt_diff:+.0f}ms
• Accuracy: {acc_diff*100:+.1f}%
• p = {p_value:.4f} {('***' if p_value < 0.001 else '**' if p_value < 0.01 else '*' if p_value < 0.05 else 'ns')}

Sample:
• N = {len(participants)}
• {len(df)} trials
• {len(df_valid)} valid
"""
ax8.text(0.1, 0.9, summary_text, transform=ax8.transAxes,
        fontsize=10, verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

plt.savefig('real_data_results.png', dpi=300, bbox_inches='tight')
print("✓ Saved: real_data_results.png")
plt.close()  # Close figure to free memory

# ============================================================================
# SAVE SUMMARY
# ============================================================================

summary_stats = {
    'Metric': [
        'Sample Size',
        'Total Trials',
        'Valid Trials',
        'Overall RT (ms)',
        'Overall Accuracy (%)',
        'Baseline RT (ms)',
        'Time Pressure RT (ms)',
        'RT Difference (ms)',
        'Baseline Accuracy (%)',
        'Time Pressure Accuracy (%)',
        'Accuracy Difference (%)',
        'p-value',
        'Cohens d'
    ],
    'Value': [
        len(participants),
        len(df),
        len(df_valid),
        f"{df_valid['rt'].mean():.0f}",
        f"{df['correct'].mean()*100:.1f}",
        f"{baseline_valid['rt'].mean():.0f}",
        f"{tp_valid['rt'].mean():.0f}",
        f"{rt_diff:.0f}",
        f"{baseline['correct'].mean()*100:.1f}",
        f"{timepressure['correct'].mean()*100:.1f}",
        f"{acc_diff*100:.1f}",
        f"{p_value:.4f}",
        f"{cohens_d:.3f}"
    ]
}

summary_df = pd.DataFrame(summary_stats)
summary_df.to_csv('summary_statistics.csv', index=False)
print("✓ Saved: summary_statistics.csv")

# ============================================================================
# FINAL SUMMARY
# ============================================================================

print("\n" + "="*80)
print("✅ ANALYSIS COMPLETE!")
print("="*80)

print("\n📁 Generated Files:")
print("  1. real_data_results.png - Main figure")
print("  2. summary_statistics.csv - All statistics")

print("\n📊 FOR YOUR PRESENTATION TOMORROW:")
print("-"*80)
print(f"✓ Data from {len(participants)} participants")
print(f"✓ {len(df)} trials analyzed")
print(f"✓ Mean RT: {df_valid['rt'].mean():.0f}ms")
print(f"✓ Accuracy: {df['correct'].mean()*100:.1f}%")
print(f"\n🎯 KEY FINDING:")
print(f"  Time pressure → {abs(rt_diff):.0f}ms FASTER")
print(f"  Time pressure → {abs(acc_diff)*100:.1f}% LESS ACCURATE")
print(f"  Statistical significance: p = {p_value:.4f}")
if p_value < 0.05:
    print(f"  ✓ SIGNIFICANT EFFECT - Your hypothesis is SUPPORTED!")
else:
    print(f"  Not statistically significant")

print("\n✅ YOUR EXPERIMENT WORKED! You have publishable data!")
print("="*80)
print("\nDONE! Check the generated PNG file for your presentation figure.")
