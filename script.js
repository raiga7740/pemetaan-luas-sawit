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