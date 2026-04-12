# ============================================================
#   AI-Based Fraud Detection System – README
# ============================================================

## 📁 Project Structure

fraud_detection/
│
├── creditcard.csv          ← Download from Kaggle (link below)
├── fraud_detection.py      ← Main ML pipeline (train + evaluate)
├── save_model.py           ← Saves trained model to rf_model.pkl
├── app.py                  ← Streamlit demo UI ⭐ (extra marks)
├── requirements.txt        ← All dependencies
└── README.md               ← This file


## 🔗 Dataset

Download from: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
→ Place `creditcard.csv` in the same folder as the scripts.


## ⚙️ Installation

pip install -r requirements.txt


## ▶️ How to Run

### Step 1 – Train the model & see results
    python fraud_detection.py

This will:
- Load and preprocess the dataset
- Apply SMOTE to handle class imbalance
- Train Logistic Regression + Random Forest
- Print accuracy, ROC-AUC, confusion matrix
- Save fraud_analysis.png and feature_importance.png

### Step 2 – Save model (for Streamlit demo)
    python save_model.py

### Step 3 – Launch the interactive UI
    streamlit run app.py


## 📊 Expected Results

| Model               | Accuracy | ROC-AUC |
|---------------------|----------|---------|
| Logistic Regression | ~97–98%  | ~0.97   |
| Random Forest ⭐    | ~99%+    | ~0.98+  |


## 🧠 How It Works

1. Dataset    → 284,807 transactions (492 fraud, rest normal)
2. Scaling    → Amount & Time normalized using StandardScaler
3. Imbalance  → SMOTE oversamples minority (fraud) class
4. Models     → Logistic Regression + Random Forest
5. Output     → 0 = Normal ✅  |  1 = Fraud 🚨
6. Demo UI    → Streamlit app with sliders & risk meter


## 👥 Work Division

| Person   | Task                                    |
|----------|-----------------------------------------|
| Person 1 | Dataset download + fraud_detection.py   |
| Person 2 | save_model.py + app.py (Streamlit UI)   |
| Person 3 | Report + PPT using charts from Step 1   |
