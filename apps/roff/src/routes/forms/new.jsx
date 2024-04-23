import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { Card } from "~/components/card"
import { useFrain } from "~/lib/frain-provider"

export default function FormsNew() {
  const db = useFrain()

  const handleSaveDraft = () => {
    db.from('forms').insert({ name: 'Test form 1' })
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <a href="/forms" class="font-bold text-blue-700 hover:underline">🡨 My forms</a>
          <span>/</span>
          <Input value="Untitled form" placeholder="Form name" />
        </div>
        <div class="space-x-2">
          <Button onClick={handleSaveDraft}>Preview</Button>
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
