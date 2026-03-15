import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/layout.css'
import './styles/login.css'
import './styles/modal.css'
import './styles/dashboard.css'
import './styles/table.css'
import './styles/productos.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
