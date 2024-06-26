import { useNavigate } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"

import { useFrain } from '~/lib/frain-provider'
import { Button, button } from "~/components/ui/button"
import { Plus } from "~/components/ui/icons"
import { Card } from "~/components/ui/card"
import { useWallet } from "~/lib/wallet-provider"

export default function Forms() {
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const [forms, setForms] = createSignal([])
  const db = useFrain()

  // TODO: make sign in use cookie based auth
  createEffect(() => {
    if (!isConnected()) {
      navigate('/')
      return
    }
    setForms(db.from('forms').findAll())
  })

  const handleNewDraft = () => {
    const id = db.from('forms').insert({
      name: 'Untitled form',
      title: 'Untitled form',
      desc: '',
      status: 'draft',
    })
    // I just prefer to use relative paths from the root, not the current path
    navigate(`/forms/${id}`, { resolve: false })
  }

  const handleDeleteQuestion = (e, id) => {
    // stop navigting from parent a tag
    e.preventDefault()
    db.from('forms').delete(id)
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-extrabold">My forms</h1>
        <Button class={button({ variant: 'primary' })} onClick={handleNewDraft}>
          <Plus strokeWidth={2} />
          New form
        </Button>
      </div>
      <div class="flex flex-col gap-3">
        <ul class="space-y-1">
          <Show when={forms() && forms().length > 0} fallback={EmptyState}>
            <For each={forms()}>
              {(form) => (
                <li>
                  <a href={`/forms/${form.id}`} class="cursor-default">
                    <Card class="flex items-center gap-4 py-2  hover:bg-neutral-100">
                      <p>{form.name}</p>
                      <p>{form.status}</p>
                      <Button onClick={(e) => handleDeleteQuestion(e, form.id)}>Delete</Button>
                    </Card>
                  </a>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <>
      <h2>You have no forms</h2>
    </>
  )
}
