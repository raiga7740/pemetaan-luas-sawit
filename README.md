# PalmScope WebGIS + Machine Learning

WebGIS tetap merupakan website statis qgis2web. Machine Learning hanya ditambahkan
sebagai Python Serverless Function di folder `api`.

## Struktur penting

- `index.html` — WebGIS statis
- `script.js` — frontend WebGIS + request ML
- `model_kualitas_lahan.pkl` — model Random Forest
- `api/index.py` — API ML Flask
- `requirements.txt` — dependency Python

## Endpoint

Health check:
GET `/api/predict`

Prediksi:
POST `/api/predict`

Body:
```json
{
  "ph": 6.5,
  "nitrogen": 25,
  "kelembapan": 60
}
```

## Deploy Vercel

1. Pastikan file di atas berada di ROOT repository.
2. Tidak perlu `app.py`.
3. Tidak perlu `vercel.json`.
4. Push ke GitHub.
5. Redeploy di Vercel.

Setelah deploy, buka:
`https://DOMAIN-VERCEL/api/predict`

Jika berhasil, akan muncul JSON:
`{"ok":true,"message":"Kualitas Lahan ML API aktif."}`

Model digunakan untuk pembelajaran.
