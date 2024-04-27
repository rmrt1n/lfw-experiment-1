import { createSignal, createEffect } from 'solid-js'
import { useFrain } from '~/lib/frain-provider'
import { Card } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectOption } from "~/components/ui/select"
import { ChevronUp, ChevronDown, Plus, Trash } from '~/components/ui/icons'

export function QuestionCard(props) {
  const [nextId, setNextId] = createSignal(null)
  const db = useFrain()
  const dbQuestions = db.from('questions')
  const dbOptions = db.from('options')
  const question = () => props.question
  const id = () => props.question.id

  createEffect(() => {
    let next = db.q().find(['?e']).where([['?e', 'questions/prev', id()]])[0]
    setNextId(next ? next[0] : null)
  })

  const fromType = {
    'text': 'Free text',
    'choice-single': 'Single choice',
    'choice-multiple': 'Multiple choices',
  }
  const title = () => question().question.length > 0 ? question().question : fromType[question().type]

  const handleMoveUp = () => {
    let prevPrev = db.q().find(['?prev']).where([[question().prev, 'questions/prev', '?prev']])[0]
    prevPrev = prevPrev ? prevPrev[0] : null
    const kvs = nextId() ? [[nextId(), { prev: question().prev }]] : []
    dbQuestions.batchUpdate([
      ...kvs,
      [question().prev, { prev: id() }],
      [id(), { prev: prevPrev }],
    ])
  }

  const handleMoveDown = () => {
    let nextNext = db.q().find(['?next']).where([['?next', 'questions/prev', nextId()]])[0]
    nextNext = nextNext ? nextNext[0] : null
    const kvs = nextNext ? [[nextNext, { prev: id() }]] : []
    dbQuestions.batchUpdate([
      ...kvs,
      [nextId(), { prev: question().prev }],
      [id(), { prev: nextId() }],
    ])
  }

  const handleDeleteQuestion = () => {
    if (nextId()) {
      dbQuestions.updateDelete([nextId(), { prev: question().prev }], id())
      return
    }
    question().options.map((o) => dbOptions.delete(o.id))
    dbQuestions.delete(id())
  }

  return (
    <Card class="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p class="font-bold text-lg">{id()}</p>
        <div class="space-x-2">
          <Button size="icon" disabled={!question().prev} title="Move up" onClick={handleMoveUp}>
            <ChevronUp />
          </Button>
          <Button size="icon" disabled={!nextId()} title="Move down" onClick={handleMoveDown}>
            <ChevronDown />
          </Button>
          <Button size="icon" title="Delete question" onClick={handleDeleteQuestion}>
            <Trash />
          </Button>
        </div>
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
                  <Button size="icon"><Plus /></Button>
                  <Button size="icon"><Trash /></Button>
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
