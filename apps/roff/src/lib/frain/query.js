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

export function query(db, finds, wheres) {
  const ctxs = queryMany(db, wheres)
  if (finds.length === 0) return ctxs
  return ctxs.map((ctx) => {
    return finds.map((part) => isVariable(part) ? ctx[part] : part)
  })
}

function queryMany(db, patterns) {
  return patterns.reduce((acc, pattern) => {
    return acc.flatMap((ctx) => querySingle(db, pattern, ctx))
  }, [{}])
}

function querySingle(db, pattern, ctx) {
  const [e, a, _] = pattern
  if (Object.keys(db.eavt).length === 0) return []
  if (!isVariable(e)) {
    return Object.keys(db.eavt[e]).map((a) => {
      const triple = [e, a, db.eavt[e][a]]
      return matchPattern(pattern, triple, ctx)
    }).filter((x) => x)
  }
  if (!isVariable(a)) {
    return Object.keys(db.aevt[a]).map((e) => {
      const triple = [e, a, db.aevt[a][e]]
      return matchPattern(pattern, triple, ctx)
    }).filter((x) => x)
  }
  // later handle avet & vaet
  return Object.keys(db.eavt).reduce((acc, e) => {
    return [...acc, ...Object.keys(db.eavt[e]).map((a) => {
      const triple = [e, a, db.eavt[e][a]]
      return matchPattern(pattern, triple, ctx)
    })]
  }, []).filter((x) => x)
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
