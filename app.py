# ============================================================
#   Streamlit Demo UI – AI Fraud Detection System
#   Run with:  streamlit run app.py
# ============================================================

import streamlit as st
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler

# ── Page config ──────────────────────────────────────────────
st.set_page_config(
    page_title="AI Fraud Detection",
    page_icon="🛡️",
    layout="centered"
)

# ── Header ───────────────────────────────────────────────────
st.markdown("""
<h1 style='text-align:center; color:#e74c3c;'>🛡️ AI-Based Fraud Detection</h1>
<p style='text-align:center; color:gray;'>Credit Card Transaction Analyser · Powered by Random Forest</p>
<hr>
""", unsafe_allow_html=True)

# ── Load model (run fraud_detection.py first to train & save) ─
@st.cache_resource
def load_model():
    with open("rf_model.pkl", "rb") as f:
        return pickle.load(f)

try:
    model = load_model()
    st.success("✅ Model loaded successfully!")
except FileNotFoundError:
    st.warning("⚠️ Model file not found. Run `fraud_detection.py` first, "
               "then add `pickle.dump(rf_model, open('rf_model.pkl','wb'))` at the end.")
    st.stop()

# ── Sidebar – Input sliders ───────────────────────────────────
st.sidebar.header("📋 Transaction Details")
st.sidebar.markdown("Adjust the values to simulate a transaction:")

amount    = st.sidebar.number_input("💳 Transaction Amount (₹)", 0.0, 50000.0, 150.0, step=50.0)
time_val  = st.sidebar.number_input("⏱️ Time (seconds since first txn)", 0, 172800, 3600, step=100)

st.sidebar.markdown("---")
st.sidebar.markdown("**PCA Features (V1–V10)**")
v_vals = []
default_vals = [-1.36, -0.07,  2.54,  1.38, -0.34,  0.46,  0.24,  0.10,  0.36, -0.09]
for i in range(1, 11):
    v = st.sidebar.slider(f"V{i}", -5.0, 5.0, float(round(default_vals[i-1], 2)), 0.01)
    v_vals.append(v)

# Remaining V11–V28 set to 0 for simplicity in demo
remaining = [0.0] * 18

# ── Scale Amount & Time ───────────────────────────────────────
scaler = StandardScaler()
amount_scaled = (amount - 88.35) / 250.12   # approx dataset mean/std
time_scaled   = (time_val - 94813) / 47488

feature_order = (
    [f"V{i}" for i in range(1, 29)] + ["Amount_scaled", "Time_scaled"]
)
features = v_vals + remaining + [amount_scaled, time_scaled]
input_df = pd.DataFrame([features], columns=feature_order)

# ── Predict ───────────────────────────────────────────────────
st.markdown("## 🔍 Prediction Result")

if st.button("🚀 Analyse Transaction", use_container_width=True):
    pred  = model.predict(input_df)[0]
    prob  = model.predict_proba(input_df)[0][1] * 100

    col1, col2 = st.columns(2)

    with col1:
        if pred == 1:
            st.error("🚨 **FRAUD DETECTED**")
            st.markdown(f"<h2 style='color:#e74c3c; text-align:center'>{prob:.1f}%</h2>"
                        "<p style='text-align:center; color:gray'>Fraud Probability</p>",
                        unsafe_allow_html=True)
        else:
            st.success("✅ **Normal Transaction**")
            st.markdown(f"<h2 style='color:#2ecc71; text-align:center'>{100-prob:.1f}%</h2>"
                        "<p style='text-align:center; color:gray'>Safe Probability</p>",
                        unsafe_allow_html=True)

    with col2:
        st.metric("Amount",    f"₹{amount:,.2f}")
        st.metric("Fraud Risk", f"{prob:.2f}%",
                  delta=f"{'HIGH ⚠️' if prob > 50 else 'LOW ✅'}", delta_color="inverse")

    # Gauge bar
    st.markdown("### Risk Meter")
    color = "#e74c3c" if prob > 50 else "#2ecc71"
    st.markdown(f"""
    <div style='background:#eee; border-radius:10px; height:25px; width:100%'>
      <div style='background:{color}; width:{prob:.1f}%; height:25px;
                  border-radius:10px; text-align:center; color:white; line-height:25px;
                  font-weight:bold;'>{prob:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

# ── How it works ─────────────────────────────────────────────
st.markdown("---")
with st.expander("ℹ️ How does this work?"):
    st.markdown("""
    1. **Dataset** — Kaggle Credit Card Fraud dataset (284,807 transactions, 492 fraud)
    2. **Preprocessing** — StandardScaler for Amount & Time; SMOTE to handle class imbalance
    3. **Model** — Random Forest Classifier (100 trees)
    4. **Output** — Probability that a transaction is fraudulent
    5. **Metrics** — ~99%+ Accuracy, ROC-AUC > 0.98
    """)

st.markdown("<br><p style='text-align:center;color:gray;font-size:12px;'>"
            "Mini Project · AI Lab · Fraud Detection System</p>",
            unsafe_allow_html=True)
