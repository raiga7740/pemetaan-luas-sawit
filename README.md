# PalmScope WebGIS + Machine Learning

WebGIS tetap statis. ML dijalankan sebagai Python Serverless Function Vercel.

Struktur:
- `index.html` — WebGIS
- `script.js` — frontend
- `api/index.py` — Flask ML API
- `model_kualitas_lahan.pkl` — Random Forest
- `requirements.txt` — dependency

Endpoint utama:
`POST /api/predict`

Tes setelah deploy:
`GET https://pemetaan-luas-sawit.vercel.app/api/predict`

Jika aktif, response JSON:
`{"ok": true, "message": "Kualitas Lahan ML API aktif."}`

Tidak menggunakan `app.py` atau `vercel.json`.
