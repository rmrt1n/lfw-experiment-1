import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"
import { useFrain } from '~/lib/frain-provider'

export default function FormPublic() {
  const params = useParams()
  const [form, setForm] = createSignal({})
  const db = useFrain()

  createEffect(() => {
    setForm(
      db.q()
        .find(['?name', '?status'])
        .where([
          [params.formId, 'forms/name', '?name'],
          [params.formId, 'forms/status', '?status']
        ])
        .map(([name, status]) => ({ id: params.formId, name, status }))[0]
    )
  })

  return (
    <div class="space-y-4">
      <Switch>
        <Match when={form().status === 'draft'}>
          <h1>This form doesn't exist</h1>
        </Match>
        <Match when={form().status === 'published'}>
          <h1>{form().name}</h1>
        </Match>
      </Switch>
    </div>
  )
}
