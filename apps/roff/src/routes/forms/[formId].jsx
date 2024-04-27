import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"
import { useFrain } from '~/lib/frain-provider'
import { Button, button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Plus } from "~/components/ui/icons"
import { FormCover } from "~/components/form-cover"
import { QuestionCard } from "~/components/question-card"
import { sortByPrev } from '~/lib/utils'

export default function Form() {
  const { formId } = useParams()
  const [form, setForm] = createSignal({})
  const [questions, setQuestions] = createSignal([])
  const db = useFrain()

  // TODO: handle 404 if form is undefined
  // TODO: better abstraction for joins
  createEffect(() => {
    setForm(db.from('forms').find(formId))
    const res = db.q()
      .find(['?qid', '?question', '?desc', '?type', '?required', '?prev', '?oid', '?option'])
      .where([
        ['?qid', 'questions/form', formId],
        ['?qid', 'questions/question', '?question'],
        ['?qid', 'questions/desc', '?desc'],
        ['?qid', 'questions/type', '?type'],
        ['?qid', 'questions/required', '?required'],
        ['?qid', 'questions/prev', '?prev'],
        ['?oid', 'options/question', '?qid'],
        ['?oid', 'options/option', '?option'],
      ]).reduce((acc, [id, question, desc, type, required, prev, oid, option]) => ({
        ...acc,
        [id]: acc[id]
          ? { ...acc[id], options: [...acc[id].options, { id: oid, option }] }
          : { id, question, desc, type, required, prev, options: [{ id: oid, option }] }
      }), {})
    setQuestions(sortByPrev(res))
  })

  const handlePublish = () => {
    db.from('forms').update(formId, { status: 'published' })
    const fullPath = window.location.href.split('/forms')[0]
    alert(`Your form is now public at: ${fullPath}/f/${formId}`)
  }

  const handleNewQuestion = () => {
    const id = db.from('questions').insert({
      question: '',
      desc: '',
      type: 'text',
      required: true,
      // store the id of the previous question (linked list model to keep questions ordered)
      prev: questions().length === 0
        ? null
        : questions()[questions().length - 1].id,
      form: formId,
    })
    // insert a "dummy" option because the query engine doesn't support "OR" yet
    db.from('options').insert({ question: id, option: 'Option 1' })
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <a href="/forms" class="font-bold text-blue-700 flex-shrink-0 hover:underline">
            🡨 My forms
          </a>
          <span>/</span>
          <Input
            value={form().name}
            onChange={(e) => db.from('forms').update(formId, { name: e.target.value })}
            placeholder="Form name..."
            class="max-w-min"
          />
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
        <For each={questions()}>
          {(q) => (
            <QuestionCard question={q} />
          )}
        </For>
        <Button onClick={handleNewQuestion}>
          <Plus />
          New question
        </Button>
      </div>
    </div>
  )
}
