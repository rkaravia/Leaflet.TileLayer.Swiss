'use strict';

var map = L.map('mapid', { crs: L.CRS.EPSG2056 });

var mapLayer = L.tileLayer.swiss().addTo(map);
var satelliteLayer = L.tileLayer.swiss({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28
});

map.fitSwitzerland();

var baseMaps = {
  'Map': mapLayer,
  'Satellite (Swissimage)': satelliteLayer
};

var overlayMaps = {
  'Alps with livestock guardian dogs': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.bafu.alpweiden-herdenschutzhunde',
    maxNativeZoom: 26,
    opacity: 0.7
  }),
  'Wildlife reserves': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.bafu.wrz-jagdbanngebiete_select',
    maxNativeZoom: 26,
    opacity: 0.7
  }).addTo(map),
  'Designated wildlife areas': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.bafu.wrz-wildruhezonen_portal',
    maxNativeZoom: 26,
    opacity: 0.7
  }),
  'Slope classes over 30°': L.tileLayer.swiss({
    format: 'png',
    layer: 'ch.swisstopo.hangneigung-ueber_30',
    maxNativeZoom: 25,
    opacity: 0.4
  })
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
