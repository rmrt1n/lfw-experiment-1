import { useFrain } from '~/lib/frain-provider'
import { Card } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectOption } from "~/components/ui/select"
import { Plus, Trash } from './ui/icons'

export function QuestionCard(props) {
  const db = useFrain()
  const dbQuestions = db.from('questions')
  const dbOptions = db.from('options')

  const question = () => props.question
  const id = () => props.question.id
  const fromType = {
    'text': 'Free text',
    'choice-single': 'Single choice',
    'choice-multiple': 'Multiple choices',
  }
  const title = question().question.length > 0 ? question().question : fromType[question().type]

  const handleDeleteQuestion = (id) => {
    if (props.next) {
      dbQuestions.update(props.next.id, { prev: question().prev })
    }
    dbQuestions.delete(id)
  }

  return (
    <Card class="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p class="font-bold text-lg">{title}</p>
        <Button onClick={() => handleDeleteQuestion(id())}>Delete</Button>
      </div>
      <div class="space-y-1">
        <label for={`${id()}-type`}>Question type</label>
        <Select
          id={`${id()}-type`}
          class="max-w-min"
          value={question().type}
          onChange={(e) => dbQuestions.update(id(), { type: e.target.value })}
        >
          <SelectOption value="text">Text</SelectOption>
          <SelectOption value="choice-single">Single choice</SelectOption>
          <SelectOption value="choice-multiple">Multiple choice</SelectOption>
        </Select>
      </div>
      <div class="space-y-1">
        <label for={`${id()}-question`}>Question</label>
        <Input
          id={`${id()}-question`}
          value={question().question}
          onChange={(e) => dbQuestions.update(id(), { question: e.target.value })}
          placeholder="Your question..."
        />
      </div>
      <div class="space-y-1">
        <label for={`${id()}-desc`}>Description</label>
        <Input
          id={`${id()}-desc`}
          value={question().desc}
          onChange={(e) => dbQuestions.update(id(), { desc: e.target.value })}
          placeholder="Your question..."
        />
      </div>
      <Show when={question().type.startsWith('choice-')}>
        <div class="space-y-1">
          <p>Choices</p>
          <ul class="space-y-2">
            <For each={question().options}>
              {(option) => (
                <li class="ml-2 flex gap-2">
                  <Input
                    value={option.option}
                    onChange={(e) => dbOptions.update(option.id, { option: e.target.value })}
                  />
                  <Button class="size-8 p-0"><Plus /></Button>
                  <Button class="size-8 p-0"><Trash /></Button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
      <div class="flex items-center gap-2">
        <Checkbox
          id={`${id()}-req`}
          checked={question().required}
          onChange={(e) => dbQuestions.update(id(), { required: e.target.checked })}
        />
        <label for={`${id()}-req`}>Required</label>
      </div>
    </Card>
  )
}
