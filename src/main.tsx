import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { desktop, syncTitleBar } from './desktop'
import { applyTheme, currentTheme } from './theme'
// Fonts ship with the app, so the first visit makes no request to anyone else's server.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/literata/400.css'
import '@fontsource/literata/400-italic.css'
import '@fontsource/literata/600.css'
import './styles.css'

applyTheme(currentTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (desktop) {
  // the window controls take the chrome's colours once the stylesheet is in, and again when the system's theme changes
  window.addEventListener('load', syncTitleBar)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTitleBar)
} else if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registered where the app is served from: on the website it lives under app/
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}
