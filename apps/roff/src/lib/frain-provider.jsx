import { createContext, createSignal, useContext, onCleanup, onMount } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import { createTransactor } from '~/lib/frain/db'
import { createQueryClient } from '~/lib/frain/query'
import { id } from '~/lib/frain/utils'
import { serializeStorage, buildIndexes } from '~/lib/frain/store'

const STORAGE_KEY = 'frain'
const initialState = {
  eavt: {},
  aevt: {},
  // avet: {}, // add this after schemas are implemented
  // vaet: {}, // add this after we have reference types
  // log: [], // log might be too large in client
  storage: {},
  maxTx: 0,
  cid: '',
}

const FrainContext = createContext(initialState)

export function FrainProvider(props) {
  const [db, setDb] = makePersisted(createSignal(initialState), {
    name: STORAGE_KEY,
    serialize: (db) => serializeStorage(db),
    deserialize: (s) => buildIndexes(s)
  })
  let ws;

  onMount(() => {
    // if client isn't initialized, assign cid
    const cid = id()
    if (db().cid.length === 0) setDb({ ...db(), cid })

    const host = window.location.host
    ws = new WebSocket(`ws://${host}/_sync`)
    // register client
    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'register',
        body: { cid: db().cid }
      }))
    }
    ws.onmessage = (event) => console.log(event.data)

    // close ws conn
    onCleanup(() => ws.close())
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
