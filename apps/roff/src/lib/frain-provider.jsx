import { createContext, createSignal, useContext, onCleanup, onMount, createEffect } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import { createTransactor } from '~/lib/frain/db'
import { createQueryClient } from '~/lib/frain/query'
import { id } from '~/lib/frain/utils'
import { serializeStorage, buildIndexes } from '~/lib/frain/store'
import { batchMerge } from '~/lib/frain/db'

const STORAGE_KEY = 'frain'
const initialState = {
  eavt: {},
  aevt: {},
  // avet: {}, // add this after schemas are implemented
  // vaet: {}, // add this after we have reference types
  // log: [], // log might be too large in client
  storage: {},
  log: {}, // log of unsynced transactions (map of tx -> [e a v op])
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
  const [isOnline, setIsOnline] = createSignal(false)
  let ws;

  onMount(() => {
    // if client isn't initialized, assign cid
    const cid = id()
    if (db().cid.length === 0) setDb({ ...db(), cid })

    const host = window.location.host
    ws = new WebSocket(`ws://${host}/_sync`)
    // register client
    ws.onopen = () => {
      setIsOnline(true)
      ws.send(JSON.stringify({
        action: 'register',
        body: { cid: db().cid, maxTx: db().maxTx }
      }))
    }
    // merge here
    ws.onmessage = (event) => {
      const { ok, message, action, body } = JSON.parse(event.data)
      switch (action) {
        case 'sync':
          setDb(batchMerge(db(), body.transactions))
          break
        case 'pushed':
          // remove pushed txs from db log (check txs)
          setDb({
            ...db(),
            log: Object.keys(db().log).reduce((acc, tx) => {
              if (!body.txs.filter((t) => t === tx)) {
                acc[tx] = db().log[tx]
              }
              return acc
            }, {})
          })
          break
        default:
      }
    }
    ws.onclose = () => setIsOnline(false)

    // close ws conn
    onCleanup(() => ws.close())
  })

  createEffect(() => {
    const txs = Object.keys(db().log)
    if (txs.length === 0 || !ws || ws.readyState !== 1 || !isOnline()) return
    ws.send(JSON.stringify({
      action: 'push',
      body: {
        cid: db().cid,
        transactions: db().log
      }
    }))
  })

  const value = {
    db,
    isOnline,
    setIsOnline,
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
  if (!context) throw new Error('useFrain must be used within a FrainProvider')
  return context
}
