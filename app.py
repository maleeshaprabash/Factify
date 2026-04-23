"""
Flask backend for Fake News Classifier
Uses the pre-trained Logistic Regression (N-gram TF-IDF) model saved from the notebook.
"""

import os
import re
import pickle
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# ── NLTK data download (runs once on first launch) ────────────────────────────
try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", quiet=True)

try:
    nltk.data.find("corpora/wordnet")
except LookupError:
    nltk.download("wordnet", quiet=True)

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR  = os.path.join(BASE_DIR, "src", "models")
MODEL_PATH  = os.path.join(MODELS_DIR, "lr_ngram_model.pkl")
VEC_PATH    = os.path.join(MODELS_DIR, "vectorizer_ngram.pkl")

# ── Load model & vectorizer ───────────────────────────────────────────────────
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(VEC_PATH, "rb") as f:
    vectorizer = pickle.load(f)

# ── Preprocessing (mirrors the notebook exactly) ──────────────────────────────
lemmatizer  = WordNetLemmatizer()
stop_words  = set(stopwords.words("english"))


def preprocess_text(text: str) -> str:
    """Lowercase → remove Reuters prefix → strip punctuation → lemmatize → remove stopwords."""
    # Remove '(Reuters) -' and similar city/source tags from the beginning
    text = re.sub(r'^.*?\s*\(Reuters\)\s*-\s*', '', text, flags=re.IGNORECASE)
    
    text   = re.sub(r"[^\w\s]", "", text.lower())
    tokens = [
        lemmatizer.lemmatize(word)
        for word in text.split()
        if word not in stop_words
    ]
    return " ".join(tokens)


# ── Flask app ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)   # allow React dev server (localhost:5173) to call this API


@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON body: { "text": "<news article>" }
    Returns:          { "prediction": true|false, "confidence": 0.0-1.0, "label": "Real"|"Fake" }
    """
    data = request.get_json(force=True, silent=True)

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body."}), 400

    raw_text = data["text"].strip()
    if len(raw_text) < 10:
        return jsonify({"error": "Text is too short to analyse. Please provide a news headline or article."}), 400

    cleaned  = preprocess_text(raw_text)
    features = vectorizer.transform([cleaned])

    pred        = int(model.predict(features)[0])          # 0 = Fake, 1 = Real
    proba       = model.predict_proba(features)[0]         # [P(fake), P(real)]
    confidence  = float(max(proba))
    label       = "Real" if pred == 1 else "Fake"
    is_real     = pred == 1                                # True → real news

    return jsonify({
        "prediction": is_real,
        "label":      label,
        "confidence": round(confidence * 100, 2)
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "Logistic Regression (N-gram TF-IDF)"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Fake News Classifier API at http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
