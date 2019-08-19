// Available resolutions
// Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
const RESOLUTIONS = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
  750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1,
];

export function fromZoom(zoom) {
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

export function toZoom(resolution) {
  const zoomNext = RESOLUTIONS.findIndex(
    (resolutionDescending) => resolution >= resolutionDescending,
  );
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
