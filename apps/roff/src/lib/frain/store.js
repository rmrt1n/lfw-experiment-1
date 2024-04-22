// localstorage adapters
export function serializeStorage(db) {
  return JSON.stringify({ storage: db.storage, maxTx: db.maxTx })
}

export function buildIndexes(s) {
  const { storage, maxTx } = JSON.parse(s)
  return {
    eavt: Object.keys(storage).reduce((accE, e) => ({
      ...accE,
      [e]: Object.keys(storage[e]).reduce((accA, a) => ({
        ...accA,
        [a]: storage[e][a].value
      }), {})
    }), {}),
    aevt: Object.keys(storage).flatMap((e) => (
      Object.keys(storage[e]).map((a) => ({
        [a]: {
          [e]: storage[e][a].value
        }
      }))
    )).reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    storage,
    maxTx,
  }
}
