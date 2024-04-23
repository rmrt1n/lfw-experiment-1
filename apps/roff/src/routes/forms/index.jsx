import { useNavigate } from "@solidjs/router"
import { useFrain } from '~/lib/frain-provider'
import { Button, button } from "~/components/button"
import { Plus } from "~/components/icons"
import { createSignal, onMount } from "solid-js"
import { Card } from "~/components/card"

export default function Forms() {
  const db = useFrain()
  const navigate = useNavigate()

  const [forms, setForms] = createSignal([])
  onMount(() => {
    setForms(db.q()
      .find(['?e', '?name', '?isDraft'])
      .where([
        ['?e', 'forms/name', '?name'],
        ['?e', 'forms/isDraft', '?isDraft']
      ])
      .map(([id, name, isDraft]) => ({ id, name, isDraft })))
  })

  const createNewDraft = () => {
    db.from('forms').insert({
      name: 'Untitled form',
      isDraft: true,
    })
    // I just prefer to use relative paths from the root, not the current path
    navigate('/forms/new', { resolve: false })
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-extrabold">My forms</h1>
        <Button class={button({ variant: 'primary' })} onClick={createNewDraft}>
          <Plus strokeWidth={2} />
          New form
        </Button>
      </div>
      <div class="flex flex-col gap-3">
        <ul class="space-y-1">
          <For each={forms()}>
            {(form) => (
              <li>
                <a href={`/forms/${form.id}`} class="cursor-default">
                  <Card class="flex items-center gap-4 py-2  hover:border-neutral-400">
                    <p>{form.name}</p>
                    <p>{form.isDraft ? 'draft' : 'published'}</p>
                  </Card>
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  )
}
