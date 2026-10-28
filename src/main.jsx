/**
 * React entry point.
 * SettingsProvider wraps the whole tree so every component can read the
 * language and theme through the useSettings() hook. The global stylesheet
 * (tokens + base rules) is imported first; each component pulls in its own
 * CSS file alongside its JSX.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>,
)
