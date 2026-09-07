import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.tsx'
import Review from './Review.tsx'

const path = window.location.pathname

const Page = path === '/review' ? Review : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
