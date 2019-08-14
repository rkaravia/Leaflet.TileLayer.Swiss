import L from 'leaflet';
import * as swissgrid from 'swissgrid';

// Bounding box for tiles in LV03
// Source: https://wmts.geo.admin.ch/EPSG/21781/1.0.0/WMTSCapabilities.xml
const LV03_BOUNDS = L.bounds(
  [420000, 30000],
  [900000, 350000],
);

// Bounding box for tiles in LV95
// Source: https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
const LV95_BOUNDS = L.bounds(
  [2420000, 1030000],
  [2900000, 1350000],
);

function leafletProjection(swissgridProjection, bounds) {
  return {
    bounds,
    project: ({ lng, lat }) => {
      const [E, N] = swissgridProjection.project([lng, lat]);
      return L.point(E, N);
    },
    unproject: ({ x: E, y: N }) => {
      const [lng, lat] = swissgridProjection.unproject([E, N]);
      return L.latLng(lat, lng);
    },
  };
}

export const lv03 = leafletProjection(swissgrid.lv03, LV03_BOUNDS);
export const lv95 = leafletProjection(swissgrid.lv95, LV95_BOUNDS);
