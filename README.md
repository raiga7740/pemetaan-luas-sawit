# PalmScope Indonesia + Machine Learning — Vercel

Versi ini menggunakan ZIP WebGIS qgis2web asli sebagai dasar.

## Struktur penting

- `index.html` — WebGIS
- `script.js` — interaksi WebGIS + request ML
- `model_kualitas_lahan.pkl` — model Random Forest
- `api/predict.py` — Python Serverless Function untuk prediksi
- `requirements.txt` — dependency Python
- `vercel.json` — konfigurasi Vercel

## Deploy ke Vercel

Push seluruh isi folder ini ke repository GitHub, lalu import repository tersebut ke Vercel.

Tidak perlu menjalankan `python app.py` di Vercel.

Endpoint ML:
`POST /api/predict`

## Test lokal

Untuk melihat WebGIS secara statis, buka dengan local server seperti Live Server.
Untuk mengetes endpoint ML secara lokal, jalankan Flask dengan menyesuaikan `api/predict.py`, atau gunakan Vercel CLI.

## Catatan

Model ini mengikuti notebook pembelajaran:
- 100 data sintetis
- fitur: ph, nitrogen, kelembapan
- target: kualitas_lahan
- RandomForestClassifier

Model hanya untuk pembelajaran, bukan penilaian kualitas tanah nyata.
