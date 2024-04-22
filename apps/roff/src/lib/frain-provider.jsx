import { createContext, createSignal, useContext } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import { createTransactor } from '~/lib/frain/db'
import { createQueryClient } from '~/lib/frain/query'
import { serializeStorage, buildIndexes } from '~/lib/frain/store'

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

const FrainContext = createContext(initialState)

export function FrainProvider(props) {
  const [db, setDb] = makePersisted(createSignal(initialState), {
    name: STORAGE_KEY,
    serialize: (db) => serializeStorage(db),
    deserialize: (s) => buildIndexes(s)
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
