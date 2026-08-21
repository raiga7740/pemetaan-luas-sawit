/* ==========================================
   MOUSE COORDINATES
========================================== */

map.on("pointermove", function (evt) {

    const coordinate = ol.proj.toLonLat(evt.coordinate);

    document.getElementById("latitude").textContent =
        coordinate[1].toFixed(6);

    document.getElementById("longitude").textContent =
        coordinate[0].toFixed(6);

});


/* ==========================================
   ZOOM LEVEL
========================================== */

function updateZoom() {

    document.getElementById("zoom-level").textContent =
        map.getView().getZoom().toFixed(1);

}

map.getView().on("change:resolution", updateZoom);

updateZoom();


/* ==========================================
   SCALE
========================================== */

const scaleLine = new ol.control.ScaleLine();

map.addControl(scaleLine);

function updateScale() {

    const resolution = map.getView().getResolution();

    const dpi = 25.4 / 0.28;

    const metersPerUnit =
        map.getView().getProjection().getMetersPerUnit();

    const scale =
        resolution * metersPerUnit * 39.37 * dpi;

    document.getElementById("scale").textContent =
        "1 : " + Math.round(scale).toLocaleString("id-ID");

}

map.getView().on("change:resolution", updateScale);

updateScale();


/* ==========================================
   CLOCK (WIB)
========================================== */

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("id-ID", {
            timeZone: "Asia/Jakarta"
        });

}

setInterval(updateClock, 1000);

updateClock();


/* ==========================================
   ACTIVE LAYER
========================================== */

document.getElementById("layer-name").textContent =
    "Oil Palm Plantation";


/* ==========================================
   SELECTED PROVINCE
========================================== */

map.on("singleclick", function (evt) {

    let province = "None";

    map.forEachFeatureAtPixel(evt.pixel, function (feature) {

        province = feature.get("NAME_1") || "Unknown";

        return true;

    });

    document.getElementById("province-name").textContent =
        province;

});

/* ==========================================
   MACHINE LEARNING - KUALITAS LAHAN
========================================== */

const mlForm = document.getElementById("ml-form");

if (mlForm) {
    const submitBtn = document.getElementById("ml-submit");
    const resultContainer = document.getElementById("ml-result");
    const confidenceValue = document.getElementById("ml-confidence-value");
    const progressBar = document.getElementById("ml-progress-bar");
    const errorContainer = document.getElementById("ml-error");

    mlForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const phInput = document.getElementById("ml-ph");
        const nitrogenInput = document.getElementById("ml-nitrogen");
        const kelembapanInput = document.getElementById("ml-kelembapan");

        if (!phInput || !nitrogenInput || !kelembapanInput) {
            console.error("Elemen input ML tidak ditemukan.");
            return;
        }

        const ph = parseFloat(phInput.value);
        const nitrogen = parseFloat(nitrogenInput.value);
        const kelembapan = parseFloat(kelembapanInput.value);

        // Reset error state
        if (errorContainer) {
            errorContainer.style.display = "none";
            errorContainer.textContent = "";
        }

        // Set loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Menganalisis...";
        }

        try {
            const payload = {
                ph: ph,
                nitrogen: nitrogen,
                kelembapan: kelembapan
            };

            const isHttps = window.location.protocol === "https:";
            const endpoints = ["/api/predict"];
            if (!isHttps) {
                endpoints.push("http://127.0.0.1:5000/api/predict");
                endpoints.push("http://localhost:5000/api/predict");
            }

            let data = null;
            let lastError = null;

            for (const url of endpoints) {
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });

                    const contentType = response.headers.get("content-type") || "";
                    if (!contentType.includes("application/json")) {
                        // Returned HTML page (e.g. 404 page from static live server)
                        continue;
                    }

                    const json = await response.json();

                    if (!response.ok) {
                        throw new Error(json.error || `Server error (${response.status})`);
                    }

                    data = json;
                    break;
                } catch (err) {
                    lastError = err;
                    if (err.message && !err.message.includes("Unexpected token") && !err.message.includes("Failed to fetch")) {
                        // Standard validation error from Flask API
                        throw err;
                    }
                }
            }

            if (!data) {
                throw lastError || new Error("Gagal terhubung ke API Machine Learning.");
            }


            // Update UI with prediction results
            if (resultContainer) {
                resultContainer.classList.remove("good", "bad");
                const isGood = data.prediction === 1;
                resultContainer.classList.add(isGood ? "good" : "bad");

                resultContainer.innerHTML = `
                    <div class="ml-result-icon">${isGood ? "✓" : "✕"}</div>
                    <h3>${data.status}</h3>
                    <p>
                        ${isGood
                            ? "Lahan ini diprediksi memiliki kualitas yang baik dan optimal untuk pertumbuhan kelapa sawit."
                            : "Lahan ini diprediksi memiliki kualitas yang kurang memadai untuk perkebunan kelapa sawit."}
                    </p>
                `;
            }

            if (confidenceValue) {
                confidenceValue.textContent = `${data.confidence}%`;
            }

            if (progressBar) {
                progressBar.style.width = `${data.confidence}%`;
            }

        } catch (error) {
            console.error("ML Prediction Error:", error);
            if (errorContainer) {
                errorContainer.style.display = "block";
                errorContainer.textContent = error.message || "Terjadi kesalahan saat memproses prediksi.";
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Analisis Kualitas Lahan";
            }
        }
    });
}


