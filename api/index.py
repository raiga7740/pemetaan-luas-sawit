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


def health_response():
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


def make_prediction():
    if MODEL_ERROR:
        return jsonify({
            "error": "Model gagal dimuat.",
            "detail": MODEL_ERROR
        }), 500

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"error": "Request body harus berupa JSON."}), 400

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
        return jsonify({"error": f"Input {exc.args[0]} wajib diisi."}), 400
    except (TypeError, ValueError):
        return jsonify({
            "error": "pH, nitrogen, dan kelembapan harus berupa angka."
        }), 400
    except Exception as exc:
        return jsonify({
            "error": "Prediksi gagal.",
            "detail": str(exc)
        }), 500


# Vercel's documented full-path routes.
@app.route("/api/predict", methods=["GET"])
def api_health():
    return health_response()


@app.route("/api/predict", methods=["POST"])
def api_predict():
    return make_prediction()


# Fallback routes in case the Vercel runtime passes a path relative
# to the Python function.
@app.route("/predict", methods=["GET"])
def fallback_health():
    return health_response()


@app.route("/predict", methods=["POST"])
def fallback_predict():
    return make_prediction()


@app.route("/", methods=["GET"])
def root_health():
    return health_response()


if __name__ == "__main__":
    app.run(debug=True)
