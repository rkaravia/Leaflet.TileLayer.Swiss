'use strict';

var WMTS_CAPABILITIES_URL = 'https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml?lang=en';

var TABLE_COLUMNS = [
  {
    caption: 'Name',
    attribute: 'layer'
  },
  {
    caption: 'Title',
    attribute: 'title'
  },
  {
    caption: 'Format',
    attribute: 'format'
  },
  {
    caption: 'Max Zoom',
    attribute: 'maxNativeZoom'
  },
  {
    caption: 'Default Timestamp',
    attribute: 'timestamp'
  },
  {
    caption: 'Preview',
    attribute: 'preview'
  },
  {
    caption: 'Edit on CodePen',
    attribute: 'codepen'
  }
];

var DEFAULT_OPTIONS = {
  format: 'jpeg',
  layer: 'ch.swisstopo.pixelkarte-farbe',
  maxNativeZoom: 27,
  timestamp: 'current'
}

var layers;

xhrXMLRequest(WMTS_CAPABILITIES_URL, function (capabilities) {
  layers = parseWMTSCapabilities(capabilities);
  layers.forEach(addPreviewLink);
  layers.forEach(addCodepenLink);
  makeTable(layers, TABLE_COLUMNS);
});

// Adapted from: https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

  var result = {};

  if (xml.nodeType === 1) {
    // Element
    if (xml.attributes.length > 0) {
      result['@attributes'] = {};
      // Attributes
      for (var i = 0; i < xml.attributes.length; i++) {
        var attribute = xml.attributes.item(i);
        result['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // Text
    result = xml.nodeValue;
  }

  if (xml.hasChildNodes()) {
    // Children
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof (result[nodeName]) === 'undefined') {
        result[nodeName] = xmlToJson(item);
      } else {
        if (typeof (result[nodeName].push) === 'undefined') {
          var node = result[nodeName];
          result[nodeName] = [];
          result[nodeName].push(node);
        }
        result[nodeName].push(xmlToJson(item));
      }
    }
  }
  return result;
}

function xhrXMLRequest(url, onload) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    onload(xhr.responseXML.documentElement);
  }
  xhr.onerror = function () {
    console.error('Failed to load: ' + url);
  }
  xhr.open('GET', url);
  xhr.responseType = 'document';
  xhr.send();
}

function getAllTimestamps(values) {
  if (!Array.isArray(values)) {
    values = [values];
  }
  return values.map(function (value) {
    return value['#text'];
  });
}

function parseWMTSCapabilities(capabilitiesXML) {
  var capabilitiesJSON = xmlToJson(capabilitiesXML);
  var layers = capabilitiesJSON.Contents.Layer;
  return layers.map(function (layer) {
    return {
      description: layer['ows:Abstract']['#text'],
      format: layer.ResourceURL['@attributes'].template.split('.').pop(),
      layer: layer['ows:Identifier']['#text'],
      maxNativeZoom: +layer.TileMatrixSetLink.TileMatrixSet['#text'].split('_').pop(),
      timestamp: layer.Dimension.Default['#text'],
      timestamps: getAllTimestamps(layer.Dimension.Value),
      title: layer['ows:Title']['#text']
    }
  });
}

function tileLayerOptions(layer) {
  var options = {};
  for (var option in DEFAULT_OPTIONS) {
    if (layer[option] !== DEFAULT_OPTIONS[option]) {
      options[option] = layer[option];
    }
  }
  return options;
}

function addPreviewLink(layer) {
  var encodedOptions = encodeURIComponent(JSON.stringify(tileLayerOptions(layer)));
  layer.preview = '<a href="preview.html?options=' + encodedOptions + '" target="_blank">Preview</a>';
}

function editOnCodepen(layerId) {
  var css = [
    'html,',
    'body,',
    '#mapid {',
    '  height: 100%;',
    '  margin: 0;',
    '}'
  ].join('\n');

  var options = tileLayerOptions(layers[layerId]);

  var mapLayers = 'L.tileLayer.swiss(options)';
  if (options.format === 'png') {
    mapLayers = 'L.tileLayer.swiss(), ' + mapLayers;
    options.opacity = 0.5;
  }

  var js = [
    'var options = ' + JSON.stringify(options, null, 2).replace(/"([a-z]+)":/ig, "$1:") + ';',
    '',
    'var layers = [' + mapLayers + '];',
    '',
    'var map = L.map("mapid", {',
    '  crs: L.CRS.EPSG2056,',
    '  layers: layers',
    '});',
    '',
    'map.fitSwitzerland();'
  ].join('\n');

  var codepenOptions = {
    css: css,
    css_external: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css',
    editors: '001',
    layout: 'left',
    html: '<div id="mapid"></div>',
    js: js,
    js_external: [
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js',
      'https://cdn.jsdelivr.net/npm/leaflet-tilelayer-swiss@2.3.0/dist/Leaflet.TileLayer.Swiss.umd.js'
    ].join(';')
  };

  var form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://codepen.io/pen/define';
  form.target = '_blank';

  var codepenData = document.createElement('input');
  codepenData.name = 'data';
  codepenData.value = JSON.stringify(codepenOptions);
  form.appendChild(codepenData);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function addCodepenLink(layer, layerId) {
  layer.codepen = '<a title="Edit on CodePen" href="#" onclick="editOnCodepen(' + layerId + ')"><img src="img/edit-on-codepen.svg" class="edit-on-codepen"></a>';
}

function makeTable(data, columns) {
  var table = document.getElementById('table');

  var tHead = table.createTHead();
  var header = tHead.insertRow();
  columns.forEach(function (column) {
    var columnHeader = document.createElement('th');
    columnHeader.innerHTML = column.caption;
    header.appendChild(columnHeader);
  });

  var tBody = table.createTBody();
  data.forEach(function (datum) {
    var row = tBody.insertRow();
    columns.forEach(function (column) {
      row.insertCell().innerHTML = datum[column.attribute];
    });
  });

  var dataTableDom = [
    '<"row"<"col-sm-12"f>>',
    '<"row"<"col-sm-12"tr>>',
    '<"row"<"col-sm-12"i>>'
  ].join('\n');

  var dataTable = $(table).DataTable({
    dom: dataTableDom,
    language: {
      search: '_INPUT_',
      searchPlaceholder: "Search..."
    },
    paging: false
  });
  dataTable.table().container().classList.remove('container-fluid');
}
