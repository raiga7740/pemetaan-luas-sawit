from flask import Flask, request, jsonify
from pathlib import Path
import pandas as pd
import joblib

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model_kualitas_lahan.pkl"

model = joblib.load(MODEL_PATH)


@app.get("/api/predict")
def health_check():
    return jsonify({
        "ok": True,
        "message": "Kualitas Lahan ML API aktif."
    })


@app.post("/api/predict")
def predict():
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Request harus berisi JSON."
            }), 400

        ph = float(data["ph"])
        nitrogen = float(data["nitrogen"])
        kelembapan = float(data["kelembapan"])

        if not 4 <= ph <= 8:
            return jsonify({
                "error": "pH harus berada pada rentang 4–8."
            }), 400

        if not 10 <= nitrogen <= 40:
            return jsonify({
                "error": "Nitrogen harus berada pada rentang 10–40."
            }), 400

        if not 20 <= kelembapan <= 80:
            return jsonify({
                "error": "Kelembapan harus berada pada rentang 20–80."
            }), 400

        input_data = pd.DataFrame([{
            "ph": ph,
            "nitrogen": nitrogen,
            "kelembapan": kelembapan
        }])

        prediction = int(model.predict(input_data)[0])
        probabilities = model.predict_proba(input_data)[0]
        confidence = float(probabilities[prediction] * 100)

        status = (
            "LAHAN BERKUALITAS BAIK"
            if prediction == 1
            else "LAHAN BERKUALITAS BURUK"
        )

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
        return jsonify({
            "error": "Data input tidak valid."
        }), 400

    except Exception as e:
        return jsonify({
            "error": "Model gagal dijalankan: " + str(e)
        }), 500
