import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './vibe-design-system/tokens.css'
import './vibe-design-system/base.css'
import './vibe-design-system/components/components.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

