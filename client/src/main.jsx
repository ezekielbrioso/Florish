// React Application Entry Point

//Purpose: Bootstrap and render the root React component

//- Serves as the main entry point for the React application
//- Creates the React root and mounts the App component to the DOM
//- Wraps the app in StrictMode for additional development checks
//- Imports global CSS styles that apply to the entire application
//- Essential for initializing the React rendering process

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
