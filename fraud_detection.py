# ============================================================
#   AI-Based Fraud Detection System
#   Dataset: Credit Card Fraud Detection (Kaggle)
#   Tools: Python, Pandas, Scikit-learn, Matplotlib
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, roc_auc_score, roc_curve
)
from imblearn.over_sampling import SMOTE   # pip install imbalanced-learn

# ─────────────────────────────────────────────
# STEP 1 – Load Dataset
# ─────────────────────────────────────────────
print("=" * 55)
print("  AI-Based Fraud Detection System")
print("=" * 55)

df = pd.read_csv("creditcard.csv")   # place the Kaggle CSV in the same folder

print(f"\n✅ Dataset loaded: {df.shape[0]:,} rows × {df.shape[1]} columns")
print(f"\nClass distribution:\n{df['Class'].value_counts()}")
print(f"\nFraud percentage: {df['Class'].mean() * 100:.4f}%")

# ─────────────────────────────────────────────
# STEP 2 – Preprocessing
# ─────────────────────────────────────────────

# Check for missing values
print(f"\nMissing values: {df.isnull().sum().sum()}")

# Scale 'Amount' and 'Time' (V1–V28 are already PCA-scaled by Kaggle)
scaler = StandardScaler()
df["Amount_scaled"] = scaler.fit_transform(df[["Amount"]])
df["Time_scaled"]   = scaler.fit_transform(df[["Time"]])

# Drop original unscaled columns
df.drop(["Amount", "Time"], axis=1, inplace=True)

# Features & Target
X = df.drop("Class", axis=1)
y = df["Class"]

# ─────────────────────────────────────────────
# STEP 3 – Handle Class Imbalance with SMOTE
# ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nBefore SMOTE → Fraud in train: {y_train.sum()} / {len(y_train)}")
sm = SMOTE(random_state=42)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
print(f"After  SMOTE → Fraud in train: {y_train_res.sum()} / {len(y_train_res)}")

# ─────────────────────────────────────────────
# STEP 4A – Model 1: Logistic Regression
# ─────────────────────────────────────────────
print("\n" + "─" * 55)
print("  Model 1: Logistic Regression")
print("─" * 55)

lr_model = LogisticRegression(max_iter=1000, random_state=42)
lr_model.fit(X_train_res, y_train_res)
lr_pred = lr_model.predict(X_test)

print(f"Accuracy  : {accuracy_score(y_test, lr_pred) * 100:.2f}%")
print(f"ROC-AUC   : {roc_auc_score(y_test, lr_model.predict_proba(X_test)[:,1]):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, lr_pred, target_names=["Normal", "Fraud"]))

# ─────────────────────────────────────────────
# STEP 4B – Model 2: Random Forest  ⭐
# ─────────────────────────────────────────────
print("─" * 55)
print("  Model 2: Random Forest  ⭐ (Best Accuracy)")
print("─" * 55)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_model.fit(X_train_res, y_train_res)
rf_pred = rf_model.predict(X_test)

rf_accuracy  = accuracy_score(y_test, rf_pred)
rf_roc_auc   = roc_auc_score(y_test, rf_model.predict_proba(X_test)[:,1])

print(f"Accuracy  : {rf_accuracy * 100:.2f}%")
print(f"ROC-AUC   : {rf_roc_auc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, rf_pred, target_names=["Normal", "Fraud"]))

# ─────────────────────────────────────────────
# STEP 5 – Visualizations  (saved as PNG)
# ─────────────────────────────────────────────

# --- Plot 1: Class Distribution ---
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle("AI-Based Fraud Detection — Analysis", fontsize=14, fontweight="bold")

axes[0].bar(["Normal (0)", "Fraud (1)"],
            df["Class"].value_counts().values,
            color=["#2ecc71", "#e74c3c"], edgecolor="black")
axes[0].set_title("Class Distribution")
axes[0].set_ylabel("Count")
for bar, val in zip(axes[0].patches, df["Class"].value_counts().values):
    axes[0].text(bar.get_x() + bar.get_width()/2,
                 bar.get_height() + 500, f"{val:,}", ha="center", fontsize=9)

# --- Plot 2: Confusion Matrix (Random Forest) ---
cm = confusion_matrix(y_test, rf_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=axes[1],
            xticklabels=["Normal", "Fraud"],
            yticklabels=["Normal", "Fraud"])
axes[1].set_title("Confusion Matrix – Random Forest")
axes[1].set_xlabel("Predicted")
axes[1].set_ylabel("Actual")

# --- Plot 3: ROC Curve ---
fpr_lr, tpr_lr, _ = roc_curve(y_test, lr_model.predict_proba(X_test)[:,1])
fpr_rf, tpr_rf, _ = roc_curve(y_test, rf_model.predict_proba(X_test)[:,1])
axes[2].plot(fpr_lr, tpr_lr, label=f"Logistic Regression (AUC={roc_auc_score(y_test, lr_model.predict_proba(X_test)[:,1]):.3f})", color="#3498db")
axes[2].plot(fpr_rf, tpr_rf, label=f"Random Forest       (AUC={rf_roc_auc:.3f})", color="#e74c3c")
axes[2].plot([0,1],[0,1], "k--", linewidth=0.8)
axes[2].set_title("ROC Curve Comparison")
axes[2].set_xlabel("False Positive Rate")
axes[2].set_ylabel("True Positive Rate")
axes[2].legend(fontsize=8)

plt.tight_layout()
plt.savefig("fraud_analysis.png", dpi=150, bbox_inches="tight")
print("\n✅ Visualization saved → fraud_analysis.png")

# ─────────────────────────────────────────────
# STEP 6 – Feature Importance (Random Forest)
# ─────────────────────────────────────────────
importances = pd.Series(rf_model.feature_importances_, index=X.columns)
top10 = importances.nlargest(10)

plt.figure(figsize=(8, 5))
top10.sort_values().plot(kind="barh", color="#e74c3c", edgecolor="black")
plt.title("Top 10 Important Features – Random Forest", fontweight="bold")
plt.xlabel("Feature Importance Score")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=150, bbox_inches="tight")
print("✅ Feature importance saved → feature_importance.png")

# ─────────────────────────────────────────────
# STEP 7 – Live Demo (predict a single transaction)
# ─────────────────────────────────────────────
print("\n" + "=" * 55)
print("  DEMO – Predicting a Single Transaction")
print("=" * 55)

# Pick one fraud + one normal sample from the test set
sample_fraud  = X_test[y_test == 1].iloc[[0]]
sample_normal = X_test[y_test == 0].iloc[[0]]

for label, sample in [("FRAUD", sample_fraud), ("NORMAL", sample_normal)]:
    pred  = rf_model.predict(sample)[0]
    prob  = rf_model.predict_proba(sample)[0][1] * 100
    result = "🚨 FRAUD DETECTED" if pred == 1 else "✅ Normal Transaction"
    print(f"\nActual: {label}")
    print(f"  Prediction       : {result}")
    print(f"  Fraud Probability: {prob:.2f}%")

print("\n" + "=" * 55)
print("  Project Complete! 🎉")
print("=" * 55)

# ─────────────────────────────────────────────
# STEP 8 – Save Model for Streamlit App
# ─────────────────────────────────────────────
import pickle
pickle.dump(rf_model, open("rf_model.pkl", "wb"))
print("\n✅ Model saved → rf_model.pkl")
