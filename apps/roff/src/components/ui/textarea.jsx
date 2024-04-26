import { splitProps } from "solid-js"
import { cx } from '~/lib/utils'

const defaultStyles = [
  'flex w-full px-2.5 py-0.5 border border-neutral-300 rounded-md',
  'bg-neutral-100 text-neutral-800 placeholder:text-neutral-500',
  'hover:border-neutral-400',
  '[&:not(:active)]:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.06);]'
]


export function Textarea(props) {
  const [classes, value, rest] = splitProps(props, ['class'], ['value'])
  return (
    <textarea
      class={cx(...defaultStyles, classes.class)}
      {...rest}
    >
      {value.value}
    </textarea>
  )
}
