import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card } from "~/components/ui/card"
import { useFrain } from '~/lib/frain-provider'

export function FormCover(props) {
  const db = useFrain()

  const handleUpdateTitle = (e) => {
    db.from('forms').update(props.form().id, { title: e.target.value })
  }
  const handleUpdateDesc = (e) => {
    db.from('forms').update(props.form().id, { desc: e.target.value })
  }

  return (
    <Card class="space-y-2">
      <p class="font-bold text-lg">Form cover</p>
      <div class="space-y-1">
        <label for="title">Title</label>
        <Input
          id="title"
          value={props.form().title}
          placeholder="Your form title..."
          onChange={handleUpdateTitle}
        />
      </div>
      <div class="space-y-1">
        <label for="desc">Description</label>
        <Textarea
          id="desc"
          value={props.form().desc}
          placeholder="About this form..."
          rows={5}
          class="resize-none"
          onChange={handleUpdateDesc}
        />
      </div>
    </Card>
  )
}
