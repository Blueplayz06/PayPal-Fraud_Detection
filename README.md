# FraudShield AI — Fraud Detection System
> AI-based PayPal fraud detection | React + Tailwind + Flask + Scikit-learn

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Tailwind CSS, Chart.js  |
| API calls | Axios                             |
| Backend   | Flask, Flask-CORS                 |
| ML Model  | Scikit-learn (Random Forest)      |
| Sampling  | imbalanced-learn (SMOTE)          |
| Dataset   | Kaggle Credit Card Fraud Dataset  |

---

## Project Structure

```
fraud-detection/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── StatsBar.jsx
│   │       ├── TransactionForm.jsx
│   │       ├── FraudGauge.jsx
│   │       ├── ModelCharts.jsx
│   │       └── RecentTransactions.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── backend/
    ├── app.py
    ├── train_model.py
    └── requirements.txt
```

---

## Step-by-Step Setup

### Step 1 — Download the dataset

1. Go to: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
2. Download `creditcard.csv`
3. Place it inside the `backend/` folder

---

### Step 2 — Set up the Python backend

Open a terminal and run:

```bash
# Go into the backend folder
cd fraud-detection/backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (takes about 1-2 minutes)
python train_model.py
```

You should see output like:
```
[1/6] Loading dataset...
[2/6] Preparing features...
...
[6/6] Saving Random Forest model to fraud_model.pkl...
      Done! Model saved.
```

---

### Step 3 — Start the Flask server

In the same terminal (with venv active):

```bash
python app.py
```

You should see:
```
[FraudShield] Model loaded from fraud_model.pkl
 * Running on http://localhost:5000
```

Keep this terminal open.

---

### Step 4 — Set up the React frontend

Open a **new terminal** and run:

```bash
# Go into the frontend folder
cd fraud-detection/frontend

# Install Node packages
npm install

# Start the development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:3000/
```

---

### Step 5 — Open the app

Open your browser and go to:
```
http://localhost:3000
```

---

## How to use the app

1. Fill in the **Transaction Input** form (Amount, Time, V-features)
2. Click **Analyze transaction**
3. The app calls the Flask `/predict` endpoint
4. The **Fraud Probability gauge** updates with the prediction
5. The new transaction appears in the **Recent Transactions** table

You can also click **Random sample** to auto-fill the form with a random transaction.

---

## API Endpoints

| Method | Endpoint   | Description                     |
|--------|------------|---------------------------------|
| POST   | /predict   | Predict fraud for a transaction |
| GET    | /stats     | Get model evaluation stats      |
| GET    | /health    | Check if model is loaded        |

### Example POST /predict

```json
{
  "amount": 149.62,
  "time": 406,
  "v1": -1.3598,
  "v2": -0.0728,
  "v14": -2.3106
}
```

Response:
```json
{
  "fraud_probability": 0.8741,
  "prediction": 1,
  "label": "Fraud"
}
```

---

## Notes for submission

- Model achieves ~99.9% accuracy on the Kaggle test set
- SMOTE is used to handle the severe class imbalance (492 fraud out of 284,807 transactions)
- F1 score on fraud class: ~0.847 (more meaningful than raw accuracy for imbalanced data)
- Both Logistic Regression and Random Forest are trained and compared in the UI
