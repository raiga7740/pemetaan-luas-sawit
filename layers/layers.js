var wms_layers = [];


        var lyr_GoogleEarthSatelit_0 = new ol.layer.Tile({
            'title': 'Google Earth Satelit',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });
var format_gadm36_IDN_1_1 = new ol.format.GeoJSON();
var features_gadm36_IDN_1_1 = format_gadm36_IDN_1_1.readFeatures(json_gadm36_IDN_1_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_gadm36_IDN_1_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_gadm36_IDN_1_1.addFeatures(features_gadm36_IDN_1_1);
var lyr_gadm36_IDN_1_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_gadm36_IDN_1_1, 
                style: style_gadm36_IDN_1_1,
                popuplayertitle: 'gadm36_IDN_1',
                interactive: true,
    title: 'gadm36_IDN_1<br />\
    <img src="styles/legend/gadm36_IDN_1_1_0.png" /> Aceh<br />\
    <img src="styles/legend/gadm36_IDN_1_1_1.png" /> Bengkulu<br />\
    <img src="styles/legend/gadm36_IDN_1_1_2.png" /> Jambi<br />\
    <img src="styles/legend/gadm36_IDN_1_1_3.png" /> Kalimantan Barat<br />\
    <img src="styles/legend/gadm36_IDN_1_1_4.png" /> Kalimantan Tengah<br />\
    <img src="styles/legend/gadm36_IDN_1_1_5.png" /> Kalimantan Timur<br />\
    <img src="styles/legend/gadm36_IDN_1_1_6.png" /> Riau<br />\
    <img src="styles/legend/gadm36_IDN_1_1_7.png" /> Sulawesi Barat<br />\
    <img src="styles/legend/gadm36_IDN_1_1_8.png" /> Sulawesi Utara<br />\
    <img src="styles/legend/gadm36_IDN_1_1_9.png" /> Sumatera Selatan<br />' });

lyr_GoogleEarthSatelit_0.setVisible(true);lyr_gadm36_IDN_1_1.setVisible(true);
var layersList = [lyr_GoogleEarthSatelit_0,lyr_gadm36_IDN_1_1];
lyr_gadm36_IDN_1_1.set('fieldAliases', {'GID_0': 'GID_0', 'NAME_0': 'NAME_0', 'GID_1': 'GID_1', 'NAME_1': 'NAME_1', 'VARNAME_1': 'VARNAME_1', 'NL_NAME_1': 'NL_NAME_1', 'TYPE_1': 'TYPE_1', 'ENGTYPE_1': 'ENGTYPE_1', 'CC_1': 'CC_1', 'HASC_1': 'HASC_1', });
lyr_gadm36_IDN_1_1.set('fieldImages', {'GID_0': 'TextEdit', 'NAME_0': 'TextEdit', 'GID_1': 'TextEdit', 'NAME_1': 'TextEdit', 'VARNAME_1': 'TextEdit', 'NL_NAME_1': 'TextEdit', 'TYPE_1': 'TextEdit', 'ENGTYPE_1': 'TextEdit', 'CC_1': 'TextEdit', 'HASC_1': 'TextEdit', });
lyr_gadm36_IDN_1_1.set('fieldLabels', {'GID_0': 'no label', 'NAME_0': 'no label', 'GID_1': 'no label', 'NAME_1': 'no label', 'VARNAME_1': 'no label', 'NL_NAME_1': 'no label', 'TYPE_1': 'no label', 'ENGTYPE_1': 'no label', 'CC_1': 'no label', 'HASC_1': 'no label', });
lyr_gadm36_IDN_1_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});