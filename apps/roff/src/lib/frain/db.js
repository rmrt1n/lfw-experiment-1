import { id } from './utils'

export function createTransactor(db, setDb, ns) {
  return {
    insert: (kvs) => setDb(batchUpdate(db(), ns, id(), kvs)),
    update: (id, kvs) => setDb(batchUpdate(db(), ns, id, kvs)),
    // delete
  }
}

function batchUpdate(db, ns, id, kvs) {
  const nextTx = db.maxTx + 1
  return {
    ...Object.keys(kvs).reduce((acc, k) => update(acc, id, `${ns}/${k}`, kvs[k], nextTx, true), db)
  }
}

function update(db, e, a, v, tx, op) {
  return {
    ...db,
    eavt: { ...db.eavt, [e]: { ...db.eavt[e], [a]: v } },
    aevt: { ...db.aevt, [a]: { ...db.aevt[a], [e]: v } },
    maxTx: tx,
    storage: { ...db.storage, [e]: { ...db.storage[e], [a]: { value: v, tx, op } } }
  }
}
