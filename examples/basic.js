'use strict';

var map = L.map('map', {
    crs: L.TileLayer.Swiss.crs,
    layers: [L.tileLayer.swiss()],
    maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Center the map on Bern
map.setView(L.TileLayer.Swiss.unproject(L.point([2600000, 1200000])), 16);
