import { createContext, createEffect, createSignal, useContext } from 'solid-js'
import { createTransactor, createQueryClient } from './frain'

const STORAGE_KEY = 'frain'
const initialState = {
  eavt: {},
  aevt: {},
  // avet: {}, // add this after schemas are implemented
  // vaet: {}, // add this after we have reference types
  // log: [], // log might be too large in client
  storage: {},
  maxTx: 0
}

function initDb() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) return JSON.parse(data)
  return initialState
}

const FrainContext = createContext(initialState)

export function FrainProvider(props) {
  const [db, setDb] = createSignal(initDb())

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db()))
  })

  const value = {
    db,
    from: (ns) => createTransactor(db, setDb, ns),
    q: () => createQueryClient(db)
  }

  return (
    <FrainContext.Provider value={value}>
      {props.children}
    </FrainContext.Provider>
  )
}

export function useFrain() {
  const context = useContext(FrainContext)
  if (context === undefined) throw new Error('useFrain must be used within a FrainProvider')
  return context
}
