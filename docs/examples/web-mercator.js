'use strict';

var mapLeft = L.map('map-left', { crs: L.CRS.EPSG2056 });
var swissLayer = L.tileLayer.swiss({
  minZoom: 17,
  maxZoom: 22,
}).addTo(mapLeft);

var bounds = [[45.398181, 5.140242], [48.230651, 11.47757]];
var mapRight = L.map('map-right', { maxBounds: bounds });
L.tileLayer('https://wmts{s}.geo.admin.ch/1.0.0/{id}/default/current/3857/{z}/{x}/{y}.{format}', {
  attribution: swissLayer.options.attribution,
  bounds,
  format: 'jpeg',
  id: 'ch.swisstopo.pixelkarte-farbe',
  minZoom: 10,
  maxZoom: 16,
  subdomains: '0123456789',
}).addTo(mapRight);

syncMaps(mapLeft, mapRight);
mapLeft.setView([47.45, 9.32], 18); 
addInfoOverlays(mapLeft, mapRight);

function syncMaps(mapLeft, mapRight) {
  var isInCallback = false;
  mapLeft.on('moveend', () => {
    if (isInCallback) return;
    isInCallback = true;
    const zoom = {
      17: mapRight.getZoom() === 11 ? 11 : 10,
      18: 12,
      19: 13,
      20: 14,
      21: 15,
      22: 16,
    }[mapLeft.getZoom()];
    mapRight.setView(mapLeft.getCenter(), zoom, { animate: false });
    isInCallback = false;
  });
  mapRight.on('moveend', () => {
    if (isInCallback) return;
    isInCallback = true;
    const zoom = {
      10: 17,
      11: 17,
      12: 18,
      13: 19,
      14: 20,
      15: 21,
      16: 22,
    }[mapRight.getZoom()];
    mapLeft.setView(mapRight.getCenter(), zoom, { animate: false });
    isInCallback = false;
  });
}

function addInfoOverlays(mapLeft, mapRight) {
  var Lv95Overlay = L.Control.extend({
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-info-overlay');
      container.innerHTML = '<strong>LV95 (original)</strong>';
      return container;
    }
  });
  new Lv95Overlay().addTo(mapLeft);

  var ScaleAndAngleControl = L.Control.extend({
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-info-overlay');
      var updateScaleAndAngle = function () {
        var { resolution: resolutionLeft } = getResolutionAndAngle(mapLeft);
        var { resolution: resolutionRight, angle } = getResolutionAndAngle(mapRight);
        var scale = resolutionLeft / resolutionRight;
        var scaleHtml = '<dt>Scale</dt><dd>' + scale.toFixed(2) + 'x</dd>';
        var angleHtml = '<dt>Angle</dt><dd>' + angle.toFixed(2) + '°</dd>';
        container.innerHTML = '<strong>Web Mercator (reprojected)</strong>' +
          '<dl style="margin: 0; display: grid; grid-template-columns: auto auto;">' + scaleHtml + angleHtml + '</dl>';
      }
      map.on('moveend', updateScaleAndAngle);
      updateScaleAndAngle();
      return container;
    }
  });
  new ScaleAndAngleControl().addTo(mapRight);
}

function getResolutionAndAngle(map) {
  var centerPx = map.getSize().divideBy(2);
  var center = map.containerPointToLatLng(centerPx);
  var centerLv95 = L.CRS.EPSG2056.project(center)
  var centerPlusOnePx = centerPx.add([1, 0])
  var centerPlusOne = map.containerPointToLatLng(centerPlusOnePx);
  var centerPlusOneLv95 = L.CRS.EPSG2056.project(centerPlusOne)
  var resolution = map.distance(center, centerPlusOne);
  var {y, x} = centerPlusOneLv95.subtract(centerLv95);
  var angle = Math.atan(y / x) * 180 / Math.PI;
  return {resolution, angle};
}
