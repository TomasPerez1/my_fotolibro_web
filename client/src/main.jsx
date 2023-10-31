import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes } from './router/RouterProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)