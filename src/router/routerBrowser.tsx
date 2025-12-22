import MainLayout from "../layout/Main.layout"
import NotFoundPage from "../page/notFound/NotFound.page"
import { Dashboard } from "../page/Dashboard"

import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import { routerPaths } from "./routerPaths"

export const routerBrowser = createBrowserRouter(
  createRoutesFromElements(
    <Route path={routerPaths.app} element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path={routerPaths.dashboard} element={<Dashboard />} />
      <Route path={routerPaths.notFound} element={<NotFoundPage />} />
    </Route>
  )
)