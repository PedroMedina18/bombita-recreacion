import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import '@popperjs/core/dist/cjs/popper.js';
import * as bootstrap from 'bootstrap'
import './main.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App/>
    </AuthContextProvider>
  </React.StrictMode>,
)
