# PalmScope WebGIS + ML — Vercel Ready

WebGIS tetap statis. Python hanya digunakan untuk API Machine Learning.

Struktur:
- `index.html`
- `script.js`
- `style.css`
- `model_kualitas_lahan.pkl`
- `requirements.txt`
- `api/index.py`

Vercel:
- Tidak perlu `app.py`
- Tidak perlu `vercel.json`
- Python function otomatis terdeteksi dari `api/index.py`

Endpoint frontend:
`POST /api/predict`

Untuk cek API setelah deploy:
`GET /api/predict`

Response:
`{"ok":true,"message":"Kualitas Lahan ML API aktif."}`

Catatan: Flask function dibuat dengan catch-all route agar tetap bekerja
jika runtime meneruskan path dengan atau tanpa prefix `/api`.
