"""
FraudShield AI — Model Training Script
--------------------------------------
1. Put creditcard.csv in the backend/ folder (download from Kaggle)
2. Run: python train_model.py
3. This saves fraud_model.pkl — Flask will load it automatically.
"""

import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection    import train_test_split
from sklearn.preprocessing      import StandardScaler
from sklearn.ensemble           import RandomForestClassifier
from sklearn.linear_model       import LogisticRegression
from sklearn.metrics            import (
    accuracy_score, precision_score,
    recall_score, f1_score, confusion_matrix, classification_report
)
from imblearn.over_sampling     import SMOTE          # pip install imbalanced-learn

# ──────────────────────────────────────────────
# 1. Load data
# ──────────────────────────────────────────────
CSV_PATH = "creditcard.csv"

if not os.path.exists(CSV_PATH):
    print(f"[ERROR] '{CSV_PATH}' not found.")
    print("  → Download from: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud")
    print("  → Place it in the backend/ folder and rerun this script.")
    exit(1)

print("[1/6] Loading dataset...")
df = pd.read_csv(CSV_PATH)
print(f"      Shape: {df.shape} | Fraud cases: {df['Class'].sum()}")

# ──────────────────────────────────────────────
# 2. Features & target
# ──────────────────────────────────────────────
print("[2/6] Preparing features...")
X = df.drop(columns=["Class"])
y = df["Class"]

# Scale Amount and Time (V1–V28 are already scaled by PCA)
scaler = StandardScaler()
X[["Amount", "Time"]] = scaler.fit_transform(X[["Amount", "Time"]])

# ──────────────────────────────────────────────
# 3. Train/test split
# ──────────────────────────────────────────────
print("[3/6] Splitting dataset (80/20)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ──────────────────────────────────────────────
# 4. Handle class imbalance with SMOTE
# ──────────────────────────────────────────────
print("[4/6] Applying SMOTE to balance training data...")
sm = SMOTE(random_state=42)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
print(f"      Resampled training size: {X_train_res.shape[0]}")

# ──────────────────────────────────────────────
# 5. Train models
# ──────────────────────────────────────────────
print("[5/6] Training models...")

# ─── Logistic Regression ───
print("      [LR] Training Logistic Regression...")
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train_res, y_train_res)
lr_pred = lr.predict(X_test)

print("\n  ── Logistic Regression Results ──")
print(f"  Accuracy:  {accuracy_score(y_test, lr_pred)*100:.2f}%")
print(f"  Precision: {precision_score(y_test, lr_pred)*100:.2f}%")
print(f"  Recall:    {recall_score(y_test, lr_pred)*100:.2f}%")
print(f"  F1 Score:  {f1_score(y_test, lr_pred):.4f}")
print(f"  Confusion Matrix:\n{confusion_matrix(y_test, lr_pred)}")

# ─── Random Forest ───
print("\n      [RF] Training Random Forest (this takes ~1 min)...")
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced",
)
rf.fit(X_train_res, y_train_res)
rf_pred = rf.predict(X_test)

print("\n  ── Random Forest Results ──")
print(f"  Accuracy:  {accuracy_score(y_test, rf_pred)*100:.2f}%")
print(f"  Precision: {precision_score(y_test, rf_pred)*100:.2f}%")
print(f"  Recall:    {recall_score(y_test, rf_pred)*100:.2f}%")
print(f"  F1 Score:  {f1_score(y_test, rf_pred):.4f}")
print(f"  Confusion Matrix:\n{confusion_matrix(y_test, rf_pred)}")
print("\n  Classification Report:")
print(classification_report(y_test, rf_pred, target_names=["Normal", "Fraud"]))

# ──────────────────────────────────────────────
# 6. Save best model (Random Forest)
# ──────────────────────────────────────────────
print("[6/6] Saving Random Forest model to fraud_model.pkl...")
joblib.dump(rf, "fraud_model.pkl")
print("      Done! Model saved.")
print("\n[OK] You can now run: python app.py")
