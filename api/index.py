from flask import Flask, request, jsonify
from pathlib import Path
import pandas as pd
import joblib

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model_kualitas_lahan.pkl"

try:
    model = joblib.load(MODEL_PATH)
    MODEL_ERROR = None
except Exception as exc:
    model = None
    MODEL_ERROR = str(exc)


def health():
    if MODEL_ERROR:
        return jsonify({
            "ok": False,
            "error": "Model gagal dimuat.",
            "detail": MODEL_ERROR
        }), 500

    return jsonify({
        "ok": True,
        "message": "Kualitas Lahan ML API aktif."
    })


def predict():
    if MODEL_ERROR:
        return jsonify({
            "error": "Model gagal dimuat.",
            "detail": MODEL_ERROR
        }), 500

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Request body harus berupa JSON."
            }), 400

        ph = float(data["ph"])
        nitrogen = float(data["nitrogen"])
        kelembapan = float(data["kelembapan"])

        if not 4 <= ph <= 8:
            return jsonify({"error": "pH harus berada pada rentang 4–8."}), 400

        if not 10 <= nitrogen <= 40:
            return jsonify({"error": "Nitrogen harus berada pada rentang 10–40."}), 400

        if not 20 <= kelembapan <= 80:
            return jsonify({"error": "Kelembapan harus berada pada rentang 20–80."}), 400

        X = pd.DataFrame([{
            "ph": ph,
            "nitrogen": nitrogen,
            "kelembapan": kelembapan
        }])

        prediction = int(model.predict(X)[0])
        probabilities = model.predict_proba(X)[0]
        confidence = float(probabilities[prediction] * 100)

        return jsonify({
            "prediction": prediction,
            "status": (
                "LAHAN BERKUALITAS BAIK"
                if prediction == 1
                else "LAHAN BERKUALITAS BURUK"
            ),
            "confidence": round(confidence, 1),
            "input": {
                "ph": ph,
                "nitrogen": nitrogen,
                "kelembapan": kelembapan
            }
        })

    except KeyError as exc:
        return jsonify({
            "error": f"Input {exc.args[0]} wajib diisi."
        }), 400
    except (TypeError, ValueError):
        return jsonify({
            "error": "pH, nitrogen, dan kelembapan harus berupa angka."
        }), 400
    except Exception as exc:
        return jsonify({
            "error": "Prediksi gagal.",
            "detail": str(exc)
        }), 500


# Vercel routes Python functions in api/index.py under /api/*.
# The catch-all also makes the Flask app tolerant if the runtime
# passes a path with /api removed.
@app.route("/api/predict", methods=["GET"])
def api_health():
    return health()


@app.route("/api/predict", methods=["POST"])
def api_predict():
    return predict()


if __name__ == "__main__":
    app.run(debug=True)
