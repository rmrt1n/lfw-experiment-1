import { Button } from "~/components/button"

const forms = [
  { id: 1, name: "survey 1" },
  { id: 2, name: "survey 2" },
]

export default function Forms() {
  return (
    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-extrabold">My forms</h1>
        <a href="/forms/new">New form</a>
      </div>
      <div class="flex gap-2">
        <For each={forms}>
          {(form) => (
            <div class="border p-2">
              <p>{form.id}</p>
              <p>{form.name}</p>
              <a>Edit form</a>
              <Button>test</Button>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
