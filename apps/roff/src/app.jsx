import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { MetaProvider } from '@solidjs/meta'

import RootLayout from './routes/_layout'

import './app.css'

export default function App() {
  return (
    <MetaProvider>
      <Router root={RootLayout}>
        <FileRoutes />
      </Router>
    </MetaProvider>
  )
}
