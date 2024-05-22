'use strict';

// Remove resolutions that are incompatible with Lausanne tile grid, add 0.05 resolution
const RESOLUTIONS = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
  750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, /* 2, 1.5, */ 1, 0.5, 0.25, 0.1, 0.05
];

function fromZoom(zoom) {
  if (zoom < 0) {
    return RESOLUTIONS[0];
  }
  if (zoom > RESOLUTIONS.length - 1) {
    return RESOLUTIONS[RESOLUTIONS.length - 1];
  }
  const zoomPrevious = Math.floor(zoom);
  if (zoomPrevious === zoom) {
    return RESOLUTIONS[zoom];
  }
  const resolutionPrevious = RESOLUTIONS[zoomPrevious];
  const resolutionNext = RESOLUTIONS[zoomPrevious + 1];
  const resolutionFactor = resolutionNext / resolutionPrevious;
  return resolutionPrevious * (resolutionFactor ** (zoom - zoomPrevious));
}

function toZoom(resolution) {
  let zoomNext = -1;
  for (let i = 0; i < RESOLUTIONS.length; i += 1) {
    if (resolution >= RESOLUTIONS[i]) {
      zoomNext = i;
      break;
    }
  }
  if (zoomNext === 0) {
    return 0;
  }
  if (zoomNext === -1) {
    return RESOLUTIONS.length - 1;
  }
  if (RESOLUTIONS[zoomNext] === resolution) {
    return zoomNext;
  }
  const resolutionPrevious = RESOLUTIONS[zoomNext - 1];
  const resolutionNext = RESOLUTIONS[zoomNext];
  return zoomNext + (
    Math.log(resolutionNext / resolution) / Math.log(resolutionPrevious / resolutionNext)
  );
}

const CustomSwissCRS = L.Class.extend({
  includes: L.CRS,

  initialize(options) {
    this.code = options.code;
    this.projection = options.projection;

    const origin = this.projection.bounds.getBottomLeft();
    this.transformation = new L.Transformation(1, -origin.x, -1, origin.y);
    this.infinite = false;
  },

  scale(zoom) {
    return 1 / fromZoom(zoom);
  },

  zoom(scale) {
    return toZoom(1 / scale);
  },

  distance(latLng1, latLng2) {
    const point1 = this.project(latLng1);
    const point2 = this.project(latLng2);
    return point1.distanceTo(point2);
  },
});


const customSwissCrs = new CustomSwissCRS({
  code: 'EPSG:2056-custom',
  projection: L.CRS.EPSG2056.projection,
});

const lv95 = L.CRS.EPSG2056;
const map = L.map('mapid', {
  crs: customSwissCrs,
  maxBounds: L.latLngBounds(
    lv95.unproject(lv95.projection.bounds.min),
    lv95.unproject(lv95.projection.bounds.max),
  )}
);

const skipResolutionsCount = 2;
const SwissLayerSkipResolutions = L.TileLayer.Swiss.extend({
  getTileUrl (coords) {
    let z = this._getZoomForUrl();
    if (z >= 23) {
      z += skipResolutionsCount;
    }
    const data = {
      s: this._getSubdomain(coords),
      x: coords.x,
      y: coords.y,
      z: z,
    }
    return L.Util.template(this._url, L.Util.extend(data, this.options));
  },
});

const lausanneBaseMap = L.tileLayer.swiss({
  minZoom: 18,
  maxZoom: 27,
  zoomOffset: -18,
  url: 'https://tilesmn95.lausanne.ch/tiles/1.0.0/fonds_geo_osm_bdcad_couleur/default/2021/swissgrid_05/{z}/{y}/{x}.png'
}).addTo(map);

const satelliteLayer = new SwissLayerSkipResolutions({
  layer: 'ch.swisstopo.swissimage',
  maxNativeZoom: 28 - skipResolutionsCount,
  maxZoom: 27
});

// Center map on Place Saint-François
map.setView(L.CRS.EPSG2056.unproject(L.point(2538202, 1152364)), 26);

const baseMaps = {
  'Lausanne base map': lausanneBaseMap,
  'Satellite (Swissimage)': satelliteLayer
}

L.control.layers(baseMaps, {}, { collapsed: false }).addTo(map);
