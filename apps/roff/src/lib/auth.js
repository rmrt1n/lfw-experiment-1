import { useSession } from "vinxi/http";

export function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET ?? '16charlongsecret'
  });
}

export function login(req) {
  console.log(req)
  const session = getSession()
  session.update((s) => s.account = 'alice')
  throw redirect('/forms')
}
