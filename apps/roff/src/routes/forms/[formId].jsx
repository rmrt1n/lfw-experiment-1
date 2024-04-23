import { useParams } from "@solidjs/router"
import { createSignal, onMount } from "solid-js"
import { useFrain } from '~/lib/frain-provider'
import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { Card } from "~/components/card"

export default function Form() {
  const params = useParams()
  const [form, setForm] = createSignal({})
  const db = useFrain()

  // TODO: this is probably a better api: db.from('forms').select().where({id: params.formId})
  onMount(() => {
    const res = db.q()
      .find(['?name', '?isDraft'])
      .where([
        [params.formId, 'forms/name', '?name'],
        [params.formId, 'forms/isDraft', '?isDraft']
      ])[0]
    setForm({ id: params.formId, name: res[0], isDraft: res[1] })
  })

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <a href="/forms" class="font-bold text-blue-700 hover:underline">🡨 My forms</a>
          <span>/</span>
          <Input value={form().name} placeholder="Form name" />
        </div>
        <div class="space-x-2">
          <Button>Preview</Button>
          <Button variant="primary">Publish</Button>
        </div>
      </div>
      <div>
        <Card class="thefuck">
          <h2>Welcome card</h2>
        </Card>
      </div>
    </div>
  )
}
