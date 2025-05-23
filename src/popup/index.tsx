import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/globals.css';
import Popup from './popup'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)
