export function createTransactor(db, setDb, ns) {
  return {
    insert: (kvs) => setDb(batchUpdate(db(), ns, id(), kvs)),
    update: (id, kvs) => setDb(batchUpdate(db(), ns, id, kvs)),
  }
}

function batchUpdate(db, ns, id, kvs) {
  return Object.keys(kvs).reduce((acc, k) => update(acc, id, `${ns}/${k}`, kvs[k], true), db)
}

function update(db, e, a, v, op) {
  const nextTx = db.maxTx + 1
  return {
    ...db,
    eavt: { ...db.eavt, [e]: { ...db.eavt[e], [a]: v } },
    aevt: { ...db.aevt, [a]: { ...db.aevt[a], [e]: v } },
    maxTx: nextTx,
    storage: { ...db.storage, [e]: { ...db.storage[e], [a]: { value: v, tx: nextTx, op } } }
  }
}

export function id() {
  return crypto.randomUUID()
}

export function createQueryClient(db) {
  return {
    find: (finds) => createWhereClause(db, finds)
  }
}

function createWhereClause(db, finds) {
  return {
    where: (wheres) => query(db(), finds, wheres)
  }
}


function query(db, finds, wheres) {
  const ctxs = queryMany(db, wheres)
  return ctxs.map((ctx) => {
    return finds.map((part) => isVariable(part) ? ctx[part] : part)
  })
}

function queryMany(db, patterns) {
  return patterns.reduce((acc, pattern) => {
    return acc.flatMap((ctx) => querySingle(db, pattern, ctx))
  }, [{}])
}

// fix broken if db is empty
function querySingle(db, pattern, ctx) {
  const [e, a, _] = pattern
  if (Object.keys(db.eavt).length === 0) return []
  if (!isVariable(e)) {
    return Object.keys(db.eavt[e]).map((a) => {
      const triple = [e, a, db.eavt[e][a]]
      return matchPattern(pattern, triple, ctx)
    })
  }
  if (!isVariable(a)) {
    return Object.keys(db.aevt[a]).map((e) => {
      const triple = [e, a, db.aevt[a][e]]
      return matchPattern(pattern, triple, ctx)
    })
  }
  // later handle avet & vaet
  return Object.keys(db.eavt).reduce((acc, e) => {
    return [...acc, ...Object.keys(db.eavt[e]).map((a) => {
      const triple = [e, a, db.eavt[e][a]]
      return matchPattern(pattern, triple, ctx)
    })]
  }, [])
}

function matchPattern(pattern, triple, ctx) {
  return pattern.reduce((acc, patternPart, i) => {
    return matchPart(patternPart, triple[i], acc);
  }, ctx);
}

function matchPart(patternPart, triplePart, ctx) {
  if (!ctx) return null
  if (isVariable(patternPart)) {
    return matchVariable(patternPart, triplePart, ctx)
  }
  return patternPart === triplePart ? ctx : null
}

function isVariable(s) {
  return typeof s === 'string' && s.startsWith('?');
}

function matchVariable(variable, triplePart, ctx) {
  if (ctx[variable]) {
    const bound = ctx[variable]
    return matchPart(bound, triplePart, ctx)
  }
  return { ...ctx, [variable]: triplePart }
}
