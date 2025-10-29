'use strict';

const TARGET_DPI = 254;
const CSS_DPI = 96;
const SCALE_DENOMINATORS = [10_000, 25_000, 50_000, 100_000, 200_000, 500_000, 1_000_000];
const METERS_PER_INCH = 2.54 / 100;
const PAPER_SIZES = {
  'A4 portrait': [210, 297],
  'A4 landscape': [297, 210],
  'A3 portrait': [297, 420],
  'A3 landscape': [420, 297],
  'Custom': null,
}

const map = L.map('mapid', { crs: L.CRS.EPSG2056 });
L.tileLayer.swiss().addTo(map);
map.fitSwitzerland();

addPrintControl(map);

function addPrintControl(map) {
  // Inspired by https://github.com/Leaflet/Leaflet/blob/v1.9.4/docs/examples/choropleth/example.md?plain=1#L46-L60
  // and https://github.com/Leaflet/Leaflet/blob/v1.9.4/src/control/Control.Layers.js

  const printControl = L.control();

  printControl.onAdd = function (map) {
    map.printControl = this;
    this._map = map;
    this._initLayout();
    this._printOnShortcut();
    return this._container;
  };

  printControl.expand = function () {
    L.DomUtil.addClass(this._container, 'leaflet-control-print-expanded');
    this._initSettings();
    this._addSettingsPanel();
    this._printOverlay = addPrintOverlay(this._map);
  };

  printControl.collapse = function () {
    L.DomUtil.removeClass(this._container, 'leaflet-control-print-expanded');
    this._removeSettingsPanel();
    this._printOverlay.remove();
  };

  printControl._initLayout = function () {
    const container = this._container = L.DomUtil.create('div', this._className(''));

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    const link = L.DomUtil.create('a', this._className('-toggle'), container);
    link.href = '';
    link.title = 'Print';
    link.setAttribute('role', 'button');
    link.innerHTML = getPrintIcon();
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.expand();
    });
  };

  printControl._printOnShortcut = function () {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (!L.DomUtil.hasClass(this._container, 'leaflet-control-print-expanded')) {
          this.expand();
        }
        print(map, this.settings);
      }
    });
  };

  printControl._initSettings = function () {
    const mapSize = map.getSize();
    const paperFormat = mapSize.x > mapSize.y ? 'A4 landscape' : 'A4 portrait';
    this.settings = {
      paperFormat,
      customSize: null,
      padding: 10,
      scaleDenominator: getFittingScaleDenominator(map, getPaperSizeMm({ paperFormat }))
    };
  };

  printControl._addSettingsPanel = function () {
    const panel = this._settingsPanel = L.DomUtil.create('div', this._className('-panel'), this._container);

    const panelTitle = L.DomUtil.create('h3', this._className('-title'), panel);
    panelTitle.innerText = 'Print Settings';

    const paperFormatLabel = L.DomUtil.create('label', this._className('-label'), panel);
    paperFormatLabel.innerText = 'Format'
    const paperFormatSelect = L.DomUtil.create('select', '', paperFormatLabel);
    for (const [label] of Object.entries(PAPER_SIZES)) {
      const option = L.DomUtil.create('option', '', paperFormatSelect);
      option.innerText = label;
      option.value = label;
    }
    paperFormatSelect.value = this.settings.paperFormat;
    paperFormatSelect.addEventListener('change', () => {
      this._previousPaperSize = PAPER_SIZES[this.settings.paperFormat];
      this.settings.paperFormat = paperFormatSelect.value;
      this._map.fire('printsettingschange')
    })

    const paperSizeLabel = L.DomUtil.create('label', this._className('-label'), panel);
    const updatePaperSizeVisibility = () => {
      if (PAPER_SIZES[this.settings.paperFormat]) {
        L.DomUtil.addClass(paperSizeLabel, this._className('-hidden'));
      } else {
        L.DomUtil.removeClass(paperSizeLabel, this._className('-hidden'));
        if (!this.settings.customSize) {
          this.settings.customSize = this._previousPaperSize;
          paperSizeWidth.value = this.settings.customSize[0];
          paperSizeHeight.value = this.settings.customSize[1];
        }
      }
    };
    updatePaperSizeVisibility();
    this._map.on('printsettingschange', updatePaperSizeVisibility);
    paperSizeLabel.innerText = 'Paper size [mm × mm]';
    const paperSizeInputs = L.DomUtil.create('div', this._className('-paper-size'), paperSizeLabel);
    const paperSizeWidth = L.DomUtil.create('input', '', paperSizeInputs);
    paperSizeWidth.type = 'number';
    paperSizeWidth.min = 10;
    paperSizeWidth.max = 1000;
    paperSizeWidth.addEventListener('change', () => {
      this.settings.customSize[0] = +paperSizeWidth.value;
      this._map.fire('printsettingschange')
    });
    const paperSizeHeight = L.DomUtil.create('input', '', paperSizeInputs);
    paperSizeHeight.type = 'number';
    paperSizeHeight.min = 10;
    paperSizeHeight.max = 1000;
    paperSizeHeight.addEventListener('change', () => {
      this.settings.customSize[1] = +paperSizeHeight.value;
      this._map.fire('printsettingschange')
    });

    const paddingLabel = L.DomUtil.create('label', this._className('-label'), panel);
    paddingLabel.innerText = 'Padding [mm]';
    const paddingInput = L.DomUtil.create('input', '', paddingLabel);
    paddingInput.type = 'number';
    paddingInput.min = 0;
    paddingInput.value = this.settings.padding;
    paddingInput.addEventListener('change', () => {
      this.settings.padding = +paddingInput.value;
      this._map.fire('printsettingschange')
    });

    const scaleLabel = L.DomUtil.create('label', this._className('-label'), panel);
    scaleLabel.innerText = 'Scale'
    const scaleSelect = L.DomUtil.create('select', '', scaleLabel);
    for (const scaleDenominator of SCALE_DENOMINATORS) {
      const option = L.DomUtil.create('option', '', scaleSelect);
      option.innerText = `1:${scaleDenominator / 1000} 000`;
      option.value = scaleDenominator;
    }
    scaleSelect.value = this.settings.scaleDenominator;
    scaleSelect.addEventListener('change', () => {
      this.settings.scaleDenominator = scaleSelect.value;
      this._map.fire('printsettingschange');
    })

    const buttons = L.DomUtil.create('div', this._className('-buttons'), panel);

    const cancelButton = L.DomUtil.create('button', this._className('-cancel'), buttons);
    cancelButton.type = 'button';
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', () => this.collapse());

    const printButton = L.DomUtil.create('button', this._className('-confirm'), buttons);
    printButton.type = 'button';
    printButton.innerText = 'Print';
    printButton.addEventListener('click', () => print(this._map, this.settings));

    this._formKeyupListener = (event) => {
      if (event.key === 'Escape') {
        this.collapse();
      }
      if (event.key === 'Enter') {
        print(this._map, this.settings);
      }
    };
    window.addEventListener('keyup', this._formKeyupListener);
  };

  printControl._removeSettingsPanel = function () {
    this._settingsPanel.remove();
    window.removeEventListener('keyup', this._formKeyupListener);
  };

  printControl._className = function (suffix) {
    return 'leaflet-control-print' + suffix;
  };

  printControl.addTo(map);
}

function addPrintOverlay(map) {
  const container = L.DomUtil.create('div', 'leaflet-print-overlay', map.getContainer());
  const pageOverlay = L.DomUtil.create('div', 'leaflet-print-page', container);
  function updateOverlay() {
    const { settings } = map.printControl;
    const paperSizeMm = getPaperSizeMm(settings);
    const maxPaddingMm = paperSizeMm.divideBy(2);
    const paddingMm = L.point(Math.min(maxPaddingMm.x, settings.padding), Math.min(maxPaddingMm.y, settings.padding));
    const scaleDenominator = settings.scaleDenominator;
    const paperSizePx = getPaperSizePx(map, paperSizeMm, scaleDenominator);
    const borderSizePx = map.getSize().subtract(paperSizePx).divideBy(2);
    container.style.borderWidth = `${Math.max(0, borderSizePx.y)}px ${Math.max(0, borderSizePx.x)}px`;
    const paddingPx = getPaperSizePx(map, paddingMm, scaleDenominator);
    const visiblePaddingPx = L.point(
      paddingPx.x + Math.min(0, borderSizePx.x),
      paddingPx.y + Math.min(0, borderSizePx.y)
    )
    pageOverlay.style.borderWidth = `${Math.max(0, visiblePaddingPx.y)}px ${Math.max(0, visiblePaddingPx.x)}px`;
  }
  updateOverlay();
  map.on('zoomend resize printsettingschange', updateOverlay);
  return {
    remove() {
      container.remove();
      map.off('zoomend resize printsettingschange', updateOverlay);
    }
  };
}

function getPrintIcon() {
  // From https://icons.getbootstrap.com/icons/printer/, © The Bootstrap Authors, MIT License
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
      class="bi bi-printer" viewBox="0 0 16 16">
    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2
            2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2
            2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0
            0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
  </svg>`;
}

async function print(map, settings) {
  const paperSizeMm = getPaperSizeMm(settings);
  const paddingMm = L.point(settings.padding, settings.padding);
  const targetResolution = TARGET_DPI / METERS_PER_INCH;
  const zoom = L.CRS.EPSG2056.zoom(targetResolution / settings.scaleDenominator);
  const iframe = await renderScaledMapContainer(paperSizeMm, paddingMm);
  await renderScaledMap(iframe, map.getCenter(), zoom);
  iframe.contentWindow.print();
}

async function renderScaledMapContainer(sizeMm, paddingMm) {
  const contentSizeMm = sizeMm.subtract(paddingMm.multiplyBy(2));
  const scale = CSS_DPI / TARGET_DPI;
  const inverseScalePercent = `${100 / scale}%`;
  const previousIframe = document.querySelector('.hidden-iframe');
  if (previousIframe) {
    previousIframe.remove();
  }
  const iframe = document.createElement('iframe');
  iframe.className = 'hidden-iframe'
  iframe.srcdoc = `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
          crossorigin integrity="sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H">
    <style>
      @page {
        size: ${sizeMm.x}mm ${sizeMm.y}mm;
        margin: 0;
      }
      body {
        margin: ${paddingMm.y}mm ${paddingMm.x}mm;
      }
      .crop-to-page {
        overflow: hidden;
        width: ${contentSizeMm.x}mm;
        height: ${contentSizeMm.y}mm;
      }
      .scale-map {
        height: 100%;
        scale: ${scale};
        transform-origin: top left;
      }
      #scaled-map-id {
        width: ${inverseScalePercent};
        height: ${inverseScalePercent};
      }
      .leaflet-container img.leaflet-tile {
        /* Fix for https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-3425291353 */
        mix-blend-mode: initial !important;
      }
      .leaflet-control-attribution, .leaflet-control-attribution a {
        font-size: 5mm;
        color: #333 !important;
      }
    </style>
  </head>
  
  <body>
    <div class="crop-to-page">
      <div class="scale-map">
        <div id="scaled-map-id"></div>
      </div>
    </div>
  </body>
  
  </html>`;
  document.body.appendChild(iframe);
  await new Promise(resolve => iframe.addEventListener('load', resolve));
  return iframe;
}

async function renderScaledMap(iframe, center, zoom) {
  const scaledMapRoot = iframe.contentDocument.getElementById('scaled-map-id');
  const scaledMap = L.map(scaledMapRoot, {
    crs: L.CRS.EPSG2056,
    fadeAnimation: false,
    zoomControl: false
  });
  scaledMap.attributionControl.setPrefix(false);
  const swissLayer = L.tileLayer.swiss({ pluginAttribution: false });
  swissLayer.addTo(scaledMap);
  scaledMap.setView(center, zoom);
  return new Promise(resolve => swissLayer.on('load', resolve));
}

function getPaperSizeMm(settings) {
  return L.point(PAPER_SIZES[settings.paperFormat] ?? settings.customSize);
}

function getFittingScaleDenominator(map, paperSizeMm) {
  const padding = L.point(10, 10);
  const fitToSize = map.getSize().subtract(padding.multiplyBy(2));
  for (const scaleDenominator of SCALE_DENOMINATORS.toReversed()) {
    const paperSizePx = getPaperSizePx(map, paperSizeMm, scaleDenominator);
    if (paperSizePx.x <= fitToSize.x && paperSizePx.y < fitToSize.y) {
      return scaleDenominator;
    }
  }
  return SCALE_DENOMINATORS[0];
}

function getPaperSizePx(map, paperSizeMm, scaleDenominator) {
  const printExtentMeters = paperSizeMm.multiplyBy(scaleDenominator / 1000);
  const tileMatrixMetersPerPx = L.CRS.EPSG2056.scale(map.getZoom());
  return printExtentMeters.multiplyBy(tileMatrixMetersPerPx);
}
