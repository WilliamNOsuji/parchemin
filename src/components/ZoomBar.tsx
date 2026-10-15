import './zoom.css'

export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 3
export const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
/** The next step in or out, on round numbers, so the readout reads 50 %, 75 %, 100 %. */
const STEPS = [0.1, 0.15, 0.25, 0.33, 0.5, 0.67, 0.75, 0.85, 1, 1.25, 1.5, 2, 2.5, 3]
export const zoomStep = (z: number, dir: 1 | -1) => (dir > 0 ? (STEPS.find((s) => s > z + 0.001) ?? MAX_ZOOM) : ([...STEPS].reverse().find((s) => s < z - 0.001) ?? MIN_ZOOM))

/** Zoom out, the zoom, zoom in, and Fit: where Obsidian keeps them, bottom right of a board or the Web. */
export function ZoomBar({ zoom, onZoom, onFit }: { zoom: number; onZoom: (z: number) => void; onFit: () => void }) {
  return (
    <div className="cv-zoom" role="group" aria-label="Zoom">
      <button aria-label="Zoom out" title="Zoom out" disabled={zoom <= MIN_ZOOM} onClick={() => onZoom(zoomStep(zoom, -1))}>−</button>
      <span aria-live="polite">{Math.round(zoom * 100)}%</span>
      <button aria-label="Zoom in" title="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => onZoom(zoomStep(zoom, 1))}>+</button>
      <span className="sep" aria-hidden />
      <button onClick={onFit} title="Zoom to fit">Fit</button>
    </div>
  )
}
