import L from 'leaflet';
import Proj from 'proj4leaflet';

// Available resolutions
// Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
const resolutions = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
  750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1,
];

function makeCrs(options) {
  const bounds = L.bounds(options.min, options.max);
  const origin = [options.min.x, options.max.y];
  return new Proj.CRS(options.code, options.definition, {
    bounds,
    origin,
    resolutions,
  });
}

const EPSG_2056 = makeCrs({
  // Definition for projected coordinate system CH1903+ / LV95 (EPSG:2056)
  // Source: https://epsg.io/2056.js
  code: 'EPSG:2056',
  definition: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
  // Bounding box for tiles in EPSG:2056
  // Source: https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
  min: L.point(2420000, 1030000),
  max: L.point(2900000, 1350000),
});
const project2056 = latLng => EPSG_2056.projection.project(latLng);
const unproject2056 = point => EPSG_2056.projection.unproject(point);

const EPSG_21781 = makeCrs({
  // Definition for projected coordinate system CH1903 / LV03 (EPSG:21781)
  // Source: https://epsg.io/21781.js
  code: 'EPSG:21781',
  definition: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs',
  // Bounding box for tiles in EPSG:21781
  // Source: https://wmts.geo.admin.ch/EPSG/21781/1.0.0/WMTSCapabilities.xml
  min: L.point(420000, 30000),
  max: L.point(900000, 350000),
});
const project21781 = latLng => EPSG_21781.projection.project(latLng);
const unproject21781 = point => EPSG_21781.projection.unproject(point);

const latLngBounds = L.latLngBounds(
  unproject2056(EPSG_2056.options.bounds.min),
  unproject2056(EPSG_2056.options.bounds.max),
);

const URLS = {
  'EPSG:2056': 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
  'EPSG:21781': 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/21781/{z}/{y}/{x}.{format}',
};

const Swiss = L.TileLayer.extend({
  options: {
    attribution: '<a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">swisstopo</a>',
    bounds: latLngBounds,
    crs: EPSG_2056,
    format: 'jpeg',
    layer: 'ch.swisstopo.pixelkarte-farbe',
    maxZoom: 27,
    minZoom: 0,
    subdomains: '0123456789',
    timestamp: 'current',
  },
  initialize(options) {
    L.setOptions(this, options);
    const url = URLS[this.options.crs.code];
    L.TileLayer.prototype.initialize.call(this, url, this.options);
  },
});

Swiss.latLngBounds = latLngBounds;
Swiss.EPSG_2056 = EPSG_2056;
Swiss.project_2056 = project2056;
Swiss.unproject_2056 = unproject2056;
Swiss.EPSG_21781 = EPSG_21781;
Swiss.project_21781 = project21781;
Swiss.unproject_21781 = unproject21781;

L.tileLayer.swiss = options => new Swiss(options);

export default Swiss;
