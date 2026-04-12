# save_model.py
# Run this ONCE after fraud_detection.py to save the trained model
# Then the Streamlit app (app.py) can load it

import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE

print("Loading dataset...")
df = pd.read_csv("creditcard.csv")

scaler = StandardScaler()
df["Amount_scaled"] = scaler.fit_transform(df[["Amount"]])
df["Time_scaled"]   = scaler.fit_transform(df[["Time"]])
df.drop(["Amount", "Time"], axis=1, inplace=True)

X = df.drop("Class", axis=1)
y = df["Class"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

sm = SMOTE(random_state=42)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)

print("Training Random Forest (this may take ~1–2 minutes)...")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_model.fit(X_train_res, y_train_res)

# Save the trained model
with open("rf_model.pkl", "wb") as f:
    pickle.dump(rf_model, f)

print("✅ Model saved → rf_model.pkl")
print("   Now run:  streamlit run app.py")
