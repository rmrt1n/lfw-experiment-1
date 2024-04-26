import { id } from './utils'

export function createTransactor(db, setDb, ns) {
  return {
    find: (id) => {
      return {
        id,
        ...Object.keys(db().eavt[id]).reduce((acc, a) => ({ ...acc, [a.split('/')[1]]: db().eavt[id][a] }), {})
      }
    },
    findAll: () => {
      return Object.keys(db().eavt).map((e) => ({
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
    // delete
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
  return {
    ...db,
    eavt: { ...db.eavt, [e]: { ...db.eavt[e], [a]: v } },
    aevt: { ...db.aevt, [a]: { ...db.aevt[a], [e]: v } },
    maxTx: tx,
    storage: { ...db.storage, [e]: { ...db.storage[e], [a]: { value: v, tx, op, cid } } },
  }
}

export function batchMerge(db, transactions) {
  console.log(transactions)
  if (!transactions || Object.keys(transactions).length === 0) return db
  const remoteMaxTx = Object.keys(transactions).toSorted(Math.min)[0]
  return {
    ...Object.keys(transactions).reduce((acc, tx) => transactions[tx].reduce((acc2, transaction) => merge(acc2, tx, transaction), acc), db),
    maxTx: Math.max(db.maxTx, remoteMaxTx)
  }
}

function merge(db, remoteTx, transaction) {
  console.log('test', transaction)
  const [e, a, v, op, remoteCid] = transaction

  // if eav isn't in local, then it's an insert so just update the db 
  if (!db.eavt[e] || !db.eavt[e][a]) return update(db, e, a, v, remoteTx, op)

  const { value, tx: localTx, _, cid } = db.storage[e][a]

  // else it's an update/delete
  if (localTx > remoteTx) return db
  if (localTx === remoteTx && cid > remoteCid) return db

  return update(db, e, a, v, remoteTx, op, remoteCid)
}
