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

    mlForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = document.getElementById("ml-submit");
        const resultBox = document.getElementById("ml-result");
        const errorBox = document.getElementById("ml-error");
        const confidenceValue = document.getElementById("ml-confidence-value");
        const progressBar = document.getElementById("ml-progress-bar");

        errorBox.style.display = "none";
        submitButton.disabled = true;
        submitButton.textContent = "Menganalisis...";

        const data = {
            ph: Number(document.getElementById("ml-ph").value),
            nitrogen: Number(document.getElementById("ml-nitrogen").value),
            kelembapan: Number(document.getElementById("ml-kelembapan").value)
        };

        try {

            const response = await fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ph: ph,
                    nitrogen: nitrogen,
                    kelembapan: kelembapan
                })
            });

            const contentType = response.headers.get("content-type") || "";
            const result = contentType.includes("application/json")
                ? await response.json()
                : { error: await response.text() };

            if (!response.ok) {
                throw new Error(result.error || "Prediksi gagal.");
            }

            const isGood = result.prediction === 1;

            resultBox.className = "ml-result " + (isGood ? "good" : "bad");

            resultBox.querySelector(".ml-result-icon").textContent =
                isGood ? "✓" : "×";

            resultBox.querySelector("h3").textContent =
                result.status;

            resultBox.querySelector("p").textContent =
                "pH " + result.input.ph +
                " • Nitrogen " + result.input.nitrogen +
                " • Kelembapan " + result.input.kelembapan;

            confidenceValue.textContent = result.confidence + "%";
            progressBar.style.width = result.confidence + "%";

        } catch (error) {

            errorBox.textContent = "Error: " + error.message;
            errorBox.style.display = "block";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Analisis Kualitas Lahan";

        }

    });

}
