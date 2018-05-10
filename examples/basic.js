'use strict';

var map = L.map('map', {
    crs: L.TileLayer.Swiss.EPSG_2056,
    layers: [L.tileLayer.swiss()],
    maxBounds: L.TileLayer.Swiss.latLngBounds
});

// Center the map on Bern
map.setView(L.TileLayer.Swiss.unproject_2056(L.point([2600000, 1200000])), 16);
