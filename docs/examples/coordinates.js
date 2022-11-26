'use strict';

var NARROW_NO_BREAK_SPACE = '\u202F';

var map = L.map('mapid', { crs: L.CRS.EPSG2056 });
L.tileLayer.swiss().addTo(map);

// Initialize Leaflet-hash plugin which syncs map center/zoom with URL hash
var hash = L.hash(map);
hash.update();
if (map.getZoom() === undefined) {
  // Set default view if there was no URL hash
  map.setView(L.CRS.EPSG2056.unproject(L.point(2600000, 1200000)), 21);
}

// Add scale bar on the bottom left
L.control.scale({ imperial: false, maxWidth: 200 }).addTo(map);

addCoordinatesPopupOnClick(map);
addMouseMoveCoordinates(map);

function addCoordinatesPopupOnClick(map) {
  new ClipboardJS('button').on('success', function (e) {
    var element = e.trigger;
    element.classList.add('tooltipped', 'tooltipped-s', 'tooltipped-no-delay');
    element.setAttribute('aria-label', 'Copied!');
    var removeTooltip = function() {
      element.classList.remove('tooltipped', 'tooltipped-s', 'tooltipped-no-delay');
      element.removeAttribute('aria-label');
    };
    element.addEventListener('mouseleave', removeTooltip, { once: true });
    element.addEventListener('blur', removeTooltip, { once: true });
  });
  map.on('click', function (event) {
    var latlng = event.latlng;
    var popup = L.popup(latlng, {
      content: '<div style="width: 250px;">' +
        renderCoordinates({
          label: 'LV95 (E, N)',
          id: 'coordinates-lv95',
          displayText: formatLv95Coordinates(latlng, NARROW_NO_BREAK_SPACE),
          clipboardText: formatLv95Coordinates(latlng, '')
        }) +
        renderCoordinates({
          label: 'WGS 84 (latitude, longitude)',
          id: 'coordinates-wgs84',
          displayText: formatWgs84Coordinates(latlng, true),
          clipboardText: formatWgs84Coordinates(latlng, false)
        }) +
        '</div>'
    });
    popup.openOn(map);
  });
}

function renderCoordinates(options) {
  return '' +
    '<div class="form-group">' +
    '  <div class="form-group-header"><label for="' + options.id + '">' + options.label + '</label></div>' +
    '  <div class="form-group-body">' +
    '    <div class="input-group">' +
    '      <input type="text" readonly id="' + options.id + '" class="form-control" onfocus="replaceWithClipboardText(this)"' +
    '             value="' + options.displayText + '" data-clipboard-text="' + options.clipboardText + '">' +
    '      <span class="input-group-button">' +
    '        <button class="btn-octicon" data-clipboard-text="' + options.clipboardText + '" aria-label="Copy to clipboard">' +
    '          <img src="img/copy.svg" alt="Copy to clipboard">' +
    '        </button>' +
    '      </span>' +
    '    </div>' +
    '  </div>' +
    '</div>';
}

function replaceWithClipboardText(textInput) {
  var value = textInput.value;
  var clipboardText = textInput.dataset.clipboardText;
  if (clipboardText !== value) {
    textInput.value = clipboardText;
    textInput.select();
    textInput.addEventListener('blur', function() {
      textInput.value = value;
    }, { once: true });
  }
}

function addMouseMoveCoordinates(map) {
  var MouseMoveCoordinatesControl = L.Control.extend({
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control-mouse-move-coordinates');
      container.style.background = 'rgba(255, 255, 255, 0.9)';
      container.style.border = '2px solid #777';
      container.style.padding = '2px 4px';
      container.style.color = '#333';
      container.style.fontFeatureSettings = 'tnum';
      var updateCoordinates = function (latlng) {
        var formattedCoordinates = formatLv95Coordinates(latlng, NARROW_NO_BREAK_SPACE)
        container.innerHTML = '<b>LV95 Coordinates (E, N)</b><br>' + formattedCoordinates;
      };
      map.on('mousemove', function (event) {
        updateCoordinates(event.latlng);
      });
      updateCoordinates(map.getCenter());
      return container;
    }
  });

  new MouseMoveCoordinatesControl().addTo(map);
}

function formatLv95Coordinates(latlng, separator) {
  var EN = L.CRS.EPSG2056.project(latlng);
  var coordinates = [EN.x, EN.y];
  var formattedCoordinates = coordinates.map(function(coordinate) {
    var parts = [];
    coordinate = String(Math.round(coordinate));
    while (coordinate) {
      parts.unshift(coordinate.slice(-3));
      coordinate = coordinate.slice(0, -3);
    }
    return parts.join(separator);
  });
  return formattedCoordinates.join(', ');
}

function formatWgs84Coordinates(latlng, addSuffix) {
  var coordinates = [latlng.lat, latlng.lng];
  var suffixes = ['°N', '°E'];
  var formattedCoordinates = coordinates.map(function(coordinate, i) {
    var formatted = coordinate.toFixed(5);
    if (addSuffix) {
      formatted += suffixes[i];
    }
    return formatted;
  });
  return formattedCoordinates.join(', ');
}
