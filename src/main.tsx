import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './login.tsx'
import Page1 from './page1.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path='/page1' element={<Page1/>}></Route>
        {/* You can add more routes here, e.g. dashboard */}
      </Routes>
    </Router>
  </StrictMode>,
)
