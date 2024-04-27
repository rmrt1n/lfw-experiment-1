import { splitProps } from "solid-js"
import { cx } from '~/lib/utils'

const defaultStyles = [
  'size-5 p-0 border border-neutral-300 rounded-md relative',
  'bg-neutral-100',
  '[&:not(:checked):hover]:border-neutral-400',
  'shadow-[inset_0_2px_2px_0_rgba(0,0,0,0.05)]',
  'after:content-[""] after:absolute after:top-0 after:left-0',
  'checked:bg-indigo-500 checked:border-indigo-600 checked:text-neutral-50',
  'checked:after:left-[5px] checked:after:w-[6px] checked:after:h-[12px]',
  'checked:after:border-b-2 checked:after:border-r-2 checked:after:border-neutral-50',
  'checked:after:transform checked:after:rotate-45'
]


export function Checkbox(props) {
  const [classes, rest] = splitProps(props, ['class'])
  return (
    <input type="checkbox" class={cx(...defaultStyles, classes.class)}
      {...rest} />
  )
}
