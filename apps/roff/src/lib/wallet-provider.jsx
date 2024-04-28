import { createContext, createSignal, useContext, createEffect } from 'solid-js'

const chainId = 'cosmoshub-4'

const initialState = {}

const WalletContext = createContext(initialState)

export function WalletProvider(props) {
  const [accounts, setAccounts] = createSignal(null)
  const [isConnected, setIsConnected] = createSignal(false)

  createEffect(() => {
    setIsConnected(Boolean(accounts()))
  })

  const connect = async () => {
    if (!window.keplr) {
      alert('Please install the keplr extension')
      return
    }
    await window.keplr.enable(chainId)
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts()
    setAccounts(accounts)
  }

  const disconnect = async () => {
    await window.keplr.disable()
    setAccounts(null)
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
