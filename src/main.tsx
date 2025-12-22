import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

//Libreria de notificaciones
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './index.css'
import { routerBrowser } from './router/routerBrowser'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routerBrowser} />
    <ToastContainer />
  </StrictMode>,
)
