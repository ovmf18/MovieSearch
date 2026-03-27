import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.scss'
import App from './App.tsx'
import { WatchlistProvider } from './context/WatchlistContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WatchlistProvider>
      <App />
    </WatchlistProvider>
  </StrictMode>,
)
