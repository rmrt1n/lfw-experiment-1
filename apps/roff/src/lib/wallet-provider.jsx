import { createContext, createSignal, useContext, createEffect, onMount } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'

const chainId = 'cosmoshub-4'

const STORAGE_KEY = 'frain-keplr'
const initialState = {}

const WalletContext = createContext(initialState)

export function WalletProvider(props) {
  const [account, setAccount] = makePersisted(createSignal(null), { name: STORAGE_KEY })
  // this is stored in localstorage so that we can connect automatically on mount because
  // the state is lost when the tab is refreshed.
  const [isConnected, setIsConnected] = createSignal(false)

  onMount(() => {
    console.log('test', account())
    if (account() && window.keplr) {
      window.keplr.enable(chainId).then(() => {
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        offlineSigner.getAccounts().then((a) => setAccount(a[0]))
      })
    }
  })

  createEffect(() => {
    setIsConnected(Boolean(account()))
  })

  const connect = async () => {
    if (!window.keplr) {
      alert('Please install the keplr extension')
      return
    }
    await window.keplr.enable(chainId)
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts()
    setAccount(accounts[0])
  }

  const disconnect = async () => {
    await window.keplr.disable()
    setAccount(null)
  }

  const value = {
    isConnected,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within a WalletProvider')
  return context
}
