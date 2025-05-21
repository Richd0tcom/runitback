import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Devtools from './devtools-panel.tsx'
import '../styles/globals.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Devtools />
  </StrictMode>,
)
