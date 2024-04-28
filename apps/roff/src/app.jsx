import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { MetaProvider } from '@solidjs/meta'

import { FrainProvider } from "~/lib/frain-provider";
import RootLayout from '~/routes/_layout'

import './app.css'
import { WalletProvider } from '~/lib/wallet-provider';

export default function App() {
  return (
    <MetaProvider>
      <WalletProvider>
        <FrainProvider>
          <Router root={RootLayout}>
            <FileRoutes />
          </Router>
        </FrainProvider>
      </WalletProvider>
    </MetaProvider>
  )
}
