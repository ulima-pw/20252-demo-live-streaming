import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./estilos.css"
import MainPage from './MainPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StreamerPage from './StreamerPage'
import ViewerPage from './ViewerPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <MainPage/> }/>
        <Route path='/streamer' element={ <StreamerPage/> }/>
        <Route path='/viewer' element={ <ViewerPage/> }/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
