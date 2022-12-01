function zoomDependentUrlWMSLayer(url, layerForZoom, options) {
  const ZoomDependentUrlWMSLayer = L.TileLayer.WMS.extend({
    getTileUrl(coords) {
      const { layer } = layerForZoom(this._getZoomForUrl());
      this.wmsParams.layers = layer;

      return L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
    },
  });

  return new ZoomDependentUrlWMSLayer(url, options);
}

const layers = [
  {
    layer: 'ch.swisstopo.pixelkarte-farbe',
    maxZoom: 15,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
    maxZoom: 17,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
    maxZoom: 18,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
    maxZoom: 19,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
    maxZoom: 20,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
    maxZoom: 21,
  },
  {
    layer: 'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
    maxZoom: 23,
  },
  {
    layer: 'ch.swisstopo.landeskarte-farbe-10',
    maxZoom: 26,
  },
];

const map = L.map('mapid', { crs: L.CRS.EPSG2056, zoomSnap: 0 });

const defaultMap = L.tileLayer.swiss().addTo(map);

const hiDpiMap = zoomDependentUrlWMSLayer(
  'https://wms.geo.admin.ch/',
  (zoom) => layers.find(({ maxZoom }) => (zoom <= maxZoom)),
  {
    detectRetina: true,
    format: 'image/png',
    minZoom: 14,
    maxNativeZoom: 26,
    maxZoom: 28,
    version: '1.3.0',
  },
).addTo(map);

L.control.layers(
  { 'Swiss map (default)': defaultMap },
  { 'Swiss map (HiDPI)': hiDpiMap },
  { collapsed: false },
).addTo(map);

map.fitSwitzerland();
