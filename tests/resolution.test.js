import { fromZoom, toZoom } from '../src/resolution';

[
  { zoom: -1, resolution: 4000 },
  { zoom: 0, resolution: 4000 },
  { zoom: 0.5, resolution: 3872.98 },
  { zoom: 14, resolution: 650 },
  { zoom: 14.5, resolution: 570.09 },
  { zoom: 42, resolution: 0.1 },
].forEach(({ zoom, resolution }) => {
  test(`fromZoom(${zoom})`, () => {
    expect(fromZoom(zoom)).toBeCloseTo(resolution, 2);
  });
});

[
  { resolution: 10000, zoom: 0 },
  { resolution: 4000, zoom: 0 },
  { resolution: 3900, zoom: 0.39 },
  { resolution: 250, zoom: 16 },
  { resolution: 111, zoom: 16.89 },
  { resolution: 0.01, zoom: 28 },
].forEach(({ zoom, resolution }) => {
  test(`toZoom(${resolution})`, () => {
    expect(toZoom(resolution)).toBeCloseTo(zoom, 2);
  });
});
