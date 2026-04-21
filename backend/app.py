from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow React dev server on port 3000

MODEL_PATH = "fraud_model.pkl"
CSV_PATH   = "creditcard.csv"

# Load model once at startup
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"[FraudShield] Model loaded from {MODEL_PATH}")
else:
    model = None
    print("[FraudShield] WARNING: No model found. Run train_model.py first.")

# Load dataset for sampling + fit scaler to match training
df = None
scaler = None
if os.path.exists(CSV_PATH):
    df = pd.read_csv(CSV_PATH)
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    scaler.fit(df[["Amount", "Time"]])
    print(f"[FraudShield] Dataset loaded ({len(df)} rows), scaler fitted.")
else:
    print("[FraudShield] WARNING: creditcard.csv not found. /sample will not work.")


def build_features(data: dict) -> np.ndarray:
    """
    Build the feature array from incoming JSON.
    Must match the column order used during training.
    The Kaggle creditcard.csv has: Time, V1–V28, Amount
    We scale Time and Amount to match training preprocessing.
    """
    raw_time   = data.get("time",   0)
    raw_amount = data.get("amount", 0)

    # Scale Time and Amount just like training did
    if scaler is not None:
        scaled = scaler.transform([[raw_amount, raw_time]])[0]
        scaled_amount = scaled[0]
        scaled_time   = scaled[1]
    else:
        scaled_time   = raw_time
        scaled_amount = raw_amount

    features = [
        scaled_time,
        data.get("v1",     0),
        data.get("v2",     0),
        data.get("v3",     0),
        data.get("v4",     0),
        data.get("v5",     0),
        data.get("v6",     0),
        data.get("v7",     0),
        data.get("v8",     0),
        data.get("v9",     0),
        data.get("v10",    0),
        data.get("v11",    0),
        data.get("v12",    0),
        data.get("v13",    0),
        data.get("v14",    0),
        data.get("v15",    0),
        data.get("v16",    0),
        data.get("v17",    0),
        data.get("v18",    0),
        data.get("v19",    0),
        data.get("v20",    0),
        data.get("v21",    0),
        data.get("v22",    0),
        data.get("v23",    0),
        data.get("v24",    0),
        data.get("v25",    0),
        data.get("v26",    0),
        data.get("v27",    0),
        data.get("v28",    0),
        scaled_amount,
    ]
    return np.array([features])


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided."}), 400

    try:
        features = build_features(data)
        prob        = float(model.predict_proba(features)[0][1])
        prediction  = int(prob >= 0.5)
        label       = "Fraud" if prediction == 1 else "Normal"

        return jsonify({
            "fraud_probability": round(prob, 4),
            "prediction":        prediction,
            "label":             label,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/sample", methods=["GET"])
def sample():
    """Return a real row from the dataset. Pass ?type=fraud or ?type=normal."""
    if df is None:
        return jsonify({"error": "Dataset not loaded."}), 503

    sample_type = request.args.get("type", "random")

    if sample_type == "fraud":
        pool = df[df["Class"] == 1]
    elif sample_type == "normal":
        pool = df[df["Class"] == 0]
    else:
        # 50/50 chance of fraud or normal
        pool = df[df["Class"] == 1] if np.random.random() > 0.5 else df[df["Class"] == 0]

    row = pool.sample(1).iloc[0]

    return jsonify({
        "amount": round(float(row["Amount"]), 2),
        "time":   int(row["Time"]),
        **{f"v{i}": round(float(row[f"V{i}"]), 6) for i in range(1, 29)},
        "is_fraud": int(row["Class"]),
    })


@app.route("/stats", methods=["GET"])
def stats():
    """Returns static model evaluation stats (update after retraining)."""
    return jsonify({
        "total_transactions": 284807,
        "fraud_cases":        492,
        "accuracy":           99.9,
        "f1_score":           0.847,
        "confusion_matrix": {
            "tn": 56851, "fp": 12,
            "fn": 9,     "tp": 88,
        }
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    app.run(debug=True, port=5000)

