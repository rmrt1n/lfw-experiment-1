import { id } from './utils'

export function createTransactor(db, setDb, ns) {
  return {
    find: (id) => {
      if (!db().eavt[id]) return {}
      return {
        id,
        ...Object.keys(db().eavt[id]).reduce((acc, a) => ({ ...acc, [a.split('/')[1]]: db().eavt[id][a] }), {})
      }
    },
    findAll: () => {
      return Object.keys(db().eavt)
        .filter((e) => Object.keys(db().eavt[e]).filter((a) => a.startsWith(ns)).length > 0)
        .map((e) => ({
          id: e,
          ...Object.keys(db().eavt[e]).reduce((acc, a) => ({ ...acc, [a.split('/')[1]]: db().eavt[e][a] }), {})
        }))
    },
    insert: (kvs) => {
      const newId = id()
      setDb(batchUpdate(db(), ns, newId, kvs))
      return newId
    },
    update: (id, kvs) => setDb(batchUpdate(db(), ns, id, kvs)),
    // when u need to update multiple entities in 1 transaction to avoid reactivity issues
    batchUpdate: (idkvs) => setDb(idkvs.reduce((acc, [id, kvs]) => batchUpdate(acc, ns, id, kvs), db())),
    // ugly af but there is no good abstraction for combined multiple update & deletes yet
    updateDelete: ([id, kvs], e) => setDb(batchDelete(batchUpdate(db(), ns, id, kvs), e)),
    delete: (id) => setDb(batchDelete(db(), id)),
  }
}

// equivalent of circledb's transaction
function batchUpdate(db, ns, id, kvs) {
  const nextTx = db.maxTx + 1
  return {
    ...Object.keys(kvs).reduce((acc, k) => update(acc, id, `${ns}/${k}`, kvs[k], nextTx, true, db.cid), db),
    log: { ...db.log, [nextTx]: [...(db.log[nextTx] ?? []), ...Object.keys(kvs).map((k) => [id, `${ns}/${k}`, kvs[k], true, db.cid])] }
  }
}

function update(db, e, a, v, tx, op, cid) {
  const { [e]: avs, ...newEAVT } = db.eavt
  return {
    ...db,
    eavt: op
      ? { ...db.eavt, [e]: { ...db.eavt[e], [a]: v } }
      : newEAVT,
    aevt: op
      ? { ...db.aevt, [a]: { ...db.aevt[a], [e]: v } }
      : Object.fromEntries(Object.entries(db.aevt).map(([a, evs]) => {
        const { [e]: _, ...newEVS } = evs
        return [a, newEVS]
      })),
    maxTx: tx,
    storage: { ...db.storage, [e]: { ...db.storage[e], [a]: { value: v, tx, op, cid } } },
  }
}

// deletes an entire entity
function batchDelete(db, e) {
  const nextTx = db.maxTx + 1
  const { [e]: avs, ..._ } = db.eavt
  return {
    ...Object.keys(db.storage[e]).reduce((acc, a) => update(acc, e, a, db.storage[e][a].value, nextTx, false, db.cid), db),
    log: { ...db.log, [nextTx]: [...(db.log[nextTx] ?? []), ...Object.keys(avs).map((a) => [e, a, avs[a], false, db.cid])] }
  }
}

export function batchMerge(db, transactions) {
  if (!transactions || Object.keys(transactions).length === 0) return db
  const remoteMaxTx = Object.keys(transactions).toSorted(Math.min)[0]
  return {
    ...Object.keys(transactions).reduce((acc, tx) => transactions[tx].reduce((acc2, transaction) => merge(acc2, tx, transaction), acc), db),
    maxTx: Math.max(db.maxTx, remoteMaxTx)
  }
}

function merge(db, remoteTx, transaction) {
  const [e, a, v, op, remoteCid] = transaction

  // if eav isn't in local, then it's an insert so just update the db 
  if (!db.eavt[e] || !db.eavt[e][a]) return update(db, e, a, v, remoteTx, op)

  const { value, tx: localTx, _, cid } = db.storage[e][a]

  // else it's an update/delete
  if (localTx > remoteTx) return db
  if (localTx === remoteTx && cid > remoteCid) return db

  return update(db, e, a, v, remoteTx, op, remoteCid)
}
