import { createEffect } from "solid-js"
import { Button } from "~/components/button"
import { useFrain } from "~/lib/frain-provider"

export default function FormsNew() {
  const db = useFrain()

  createEffect(() => {
    console.log(db.q().find(['?v']).where([['?id', 'forms/name', '?v']]))
  })

  const handleSaveDraft = () => {
    db.from('forms').insert({ name: 'Test form 1' })
  }

  return (
    <div>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <a href="/forms">Back</a>
          <h1 class="text-lg font-extrabold">New form</h1>
        </div>
        <div class="space-x-2">
          <Button onClick={handleSaveDraft}>Save draft</Button>
          <Button>Publish</Button>
        </div>
      </div>
      <div>
        <div class="whitespace-pre-wrap">
          {JSON.stringify(db.db(), null, 2)}
        </div>
      </div>
    </div>
  )
}
