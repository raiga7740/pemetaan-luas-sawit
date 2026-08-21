# PalmScope WebGIS + Machine Learning

WebGIS qgis2web dengan model Random Forest untuk pembelajaran.

## Struktur ML

- `api/index.py` — Flask Serverless Function Vercel
- `model_kualitas_lahan.pkl` — model Random Forest
- `requirements.txt` — dependency Python
- `.python-version` — Python 3.12
- `script.js` — memanggil endpoint `/api/predict`

## Endpoint

GET `/api/predict` untuk mengecek API.

POST `/api/predict` dengan JSON:

```json
{
  "ph": 6.5,
  "nitrogen": 25,
  "kelembapan": 60
}
```

## Deploy Vercel

Letakkan isi folder project ini sebagai root repository GitHub.

Tidak perlu `app.py` dan tidak perlu `vercel.json`.
Vercel akan mendeteksi `api/index.py` sebagai Python Function.

Catatan: model dan data merupakan bahan pembelajaran, bukan alat penilaian tanah profesional.
