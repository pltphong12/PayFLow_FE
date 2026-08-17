import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App.tsx'
import './index.css'

/**
 * Antd theme — token-driven per PayFlow MASTER.md
 * Primary: Gold #F59E0B (trust)
 * Accent button overrides applied at component level
 * Typography: IBM Plex Sans
 */
const themeConfig = {
  token: {
    colorPrimary: '#8B5CF6',       // Accent/CTA cho buttons
    colorInfo: '#F59E0B',          // Primary gold cho info/focus
    borderRadius: 8,
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
