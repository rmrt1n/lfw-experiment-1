import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"
import { useFrain } from '~/lib/frain-provider'

export default function FormPublic() {
  const { formId } = useParams()
  const [form, setForm] = createSignal({})
  const db = useFrain()

  createEffect(() => {
    setForm(
      db.q()
        .find(['?name', '?status', '?title', '?desc'])
        .where([
          [formId, 'forms/name', '?name'],
          [formId, 'forms/status', '?status'],
          [formId, 'forms/title', '?title'],
          [formId, 'forms/desc', '?desc'],
        ])
        .map(([name, status, title, desc]) => ({ id: formId, name, status, title, desc }))[0]
    )
  })

  return (
    <div class="space-y-4">
      <Switch>
        <Match when={form().status === 'draft'}>
          <h1>This form doesn't exist</h1>
        </Match>
        <Match when={form().status === 'published'}>
          <h1 class="text-lg font-extrabold">{form().title}</h1>
          <p>{form().desc}</p>
        </Match>
      </Switch>
    </div>
  )
}
