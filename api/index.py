import os
import re
import pickle
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# ── Vercel specific: NLTK downloading ─────────────────────────────────────────
nltk.data.path.append("/tmp")
try:
    nltk.download("stopwords", download_dir="/tmp", quiet=True)
    nltk.download("wordnet", download_dir="/tmp", quiet=True)
except Exception as e:
    print("NLTK download warning:", e)

# ── Paths ─────────────────────────────────────────────────────────────────────
# We are currently in 'api/', so 'src/models' is in the parent directory.
BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR  = os.path.join(BASE_DIR, "src", "models")
MODEL_PATH  = os.path.join(MODELS_DIR, "lr_ngram_model.pkl")
VEC_PATH    = os.path.join(MODELS_DIR, "vectorizer_ngram.pkl")

# ── Load model & vectorizer safely ────────────────────────────────────────────
model = None
vectorizer = None

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(VEC_PATH, "rb") as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print("Error loading models:", e)

lemmatizer  = WordNetLemmatizer()

def preprocess_text(text: str) -> str:
    """Lowercase → strip punctuation → lemmatize → remove stopwords."""
    text   = re.sub(r"[^\w\s]", "", text.lower())
    try:
        stop_words = set(stopwords.words("english"))
    except Exception:
        # Fallback if NLTK stopwords fail
        stop_words = {"the", "a", "an", "is", "at", "which", "on"}
        
    tokens = [
        lemmatizer.lemmatize(word)
        for word in text.split()
        if word not in stop_words
    ]
    return " ".join(tokens)


app = Flask(__name__)
CORS(app)

@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    if model is None or vectorizer is None:
         return jsonify({"error": "Models failed to load on the server."}), 500

    data = request.get_json(force=True, silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body."}), 400

    raw_text = data["text"].strip()
    if len(raw_text) < 10:
        return jsonify({"error": "Text is too short to analyze. Please provide a news headline or article."}), 400

    cleaned  = preprocess_text(raw_text)
    features = vectorizer.transform([cleaned])

    pred        = int(model.predict(features)[0])
    proba       = model.predict_proba(features)[0]
    confidence  = float(max(proba))
    label       = "Real" if pred == 1 else "Fake"
    is_real     = pred == 1

    return jsonify({
        "prediction": is_real,
        "label":      label,
        "confidence": round(confidence * 100, 2)
    })

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok", 
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
