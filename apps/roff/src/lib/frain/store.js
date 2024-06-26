// TODO: indexed db adapter

// localstorage adapter
export function serializeStorage(db) {
  return JSON.stringify({ storage: db.storage, maxTx: db.maxTx, cid: db.cid, log: db.log })
}

export function buildIndexes(s) {
  const { storage, maxTx, cid, log } = JSON.parse(s)
  return {
    eavt: Object.keys(storage)
      // filter out deleted entries
      .filter((e) => Object.keys(storage[e]).filter((a) => storage[e][a].op).length > 0)
      .reduce((accE, e) => ({
        ...accE,
        [e]: Object.keys(storage[e])
          .reduce((accA, a) => ({
            ...accA,
            [a]: storage[e][a].value
          }), {})
      }), {}),
    aevt: Object.keys(storage)
      .filter((e) => Object.keys(storage[e]).filter((a) => storage[e][a].op).length > 0)
      .flatMap((e) => (
        Object.keys(storage[e]).map((a) => ({
          [a]: {
            [e]: storage[e][a].value
          }
        }))
      )).reduce((acc, cur) => (
        Object.keys(cur).reduce((acc, a) => ({
          ...acc,
          [a]: { ...acc[a], ...cur[a] }
        }), acc)
      ), {}),
    storage,
    maxTx,
    cid,
    log,
  }
}
