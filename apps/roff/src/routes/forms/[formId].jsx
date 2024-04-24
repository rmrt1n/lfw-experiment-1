import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"
import { useFrain } from '~/lib/frain-provider'
import { Button, button } from "~/components/button"
import { Input } from "~/components/input"
import { FormCover } from "~/components/form-cover"
import { Plus } from "~/components/icons"

export default function Form() {
  const { formId } = useParams()
  const [form, setForm] = createSignal({})
  const db = useFrain()

  // TODO: this is probably a better api: db.from('forms').select().where({id: formId})
  // TODO: handle 404 if form is undefined
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

  const handlePublish = () => {
    db.from('forms').update(formId, { status: 'published' })
    const fullPath = window.location.href.split('/forms')[0]
    alert(`Your form is now public at: ${fullPath}/f/${formId}`)
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <a href="/forms" class="font-bold text-blue-700 flex-shrink-0 hover:underline">
            🡨 My forms
          </a>
          <span>/</span>
          <Input value={form().name} placeholder="Form name..." class="max-w-min" />
        </div>
        <div class="space-x-2">
          <Switch>
            <Match when={form().status === 'draft'}>
              <Button>Preview</Button>
              <Button variant="primary" onClick={handlePublish}>Publish</Button>
            </Match>
            <Match when={form().status === 'published'}>
              <a href={`/f/${formId}`} target="_blank" class={button({ variant: 'primary' })}>
                View public form
              </a>
            </Match>
          </Switch>
        </div>
      </div>
      <div class="space-y-4">
        <FormCover form={form} />
        <Button>
          <Plus />
          New question
        </Button>
      </div>
    </div>
  )
}
