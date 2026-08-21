from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
import pandas as pd
import joblib

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
model = joblib.load(BASE_DIR / "model_kualitas_lahan.pkl")


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.post("/predict")
def predict():
    try:
        data = request.get_json(force=True)

        ph = float(data["ph"])
        nitrogen = float(data["nitrogen"])
        kelembapan = float(data["kelembapan"])

        if not 4 <= ph <= 8:
            return jsonify({"error": "pH harus berada pada rentang 4–8."}), 400

        if not 10 <= nitrogen <= 40:
            return jsonify({"error": "Nitrogen harus berada pada rentang 10–40."}), 400

        if not 20 <= kelembapan <= 80:
            return jsonify({"error": "Kelembapan harus berada pada rentang 20–80."}), 400

        input_data = pd.DataFrame([{
            "ph": ph,
            "nitrogen": nitrogen,
            "kelembapan": kelembapan
        }])

        prediction = int(model.predict(input_data)[0])
        probabilities = model.predict_proba(input_data)[0]
        confidence = float(probabilities[prediction] * 100)

        if prediction == 1:
            status = "LAHAN BERKUALITAS BAIK"
        else:
            status = "LAHAN BERKUALITAS BURUK"

        return jsonify({
            "prediction": prediction,
            "status": status,
            "confidence": round(confidence, 1),
            "input": {
                "ph": ph,
                "nitrogen": nitrogen,
                "kelembapan": kelembapan
            }
        })

    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Data input tidak valid."}), 400


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
