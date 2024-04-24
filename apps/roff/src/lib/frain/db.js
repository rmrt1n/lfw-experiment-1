import { id } from './utils'
import { query } from './query'

export function createTransactor(db, setDb, ns) {
  return {
    find: (id) => {
      return query(db(), ['?a', '?v'], [[id, '?a', '?v']])
        .reduce((acc, [a, v]) => ({ ...acc, [a.split('/')[1]]: v }), { id })
    },
    findAll: () => {
      const res = query(db(), ['?e', '?a', '?v'], [['?e', '?a', '?v']])
        .reduce((acc, [e, a, v]) => ({ ...acc, [e]: { ...acc[e], [a.split('/')[1]]: v } }), {})
      return Object.keys(res).map((e) => ({ id: e, ...res[e] }))
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
