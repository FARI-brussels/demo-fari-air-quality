import * as L from 'leaflet'

/**
 * Light basemap for the air-quality maps.
 *
 * CARTO raster tiles now require an API key (keyless requests get an
 * "API KEY REQUIRED" watermark). Set VITE_CARTO_KEY in .env / .env.production
 * to keep the CARTO Positron look; without it we fall back to Esri's
 * World Light Gray canvas, which needs no key.
 */
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY as string | undefined

export function addBasemap(map: L.Map, opts: { minZoom?: number } = {}) {
  const minZoom = opts.minZoom ?? 12

  if (CARTO_KEY) {
    return L.tileLayer(
      `https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        minZoom,
      },
    ).addTo(map)
  }

  const esri =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_{layer}/MapServer/tile/{z}/{y}/{x}'
  const common = { maxZoom: 19, maxNativeZoom: 16, minZoom }

  const base = L.tileLayer(esri.replace('{layer}', 'Base'), {
    ...common,
    attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
  }).addTo(map)
  L.tileLayer(esri.replace('{layer}', 'Reference'), common).addTo(map)
  return base
}
