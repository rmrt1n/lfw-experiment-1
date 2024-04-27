import { splitProps } from "solid-js"
import { cx } from '~/lib/utils'

const defaultStyles = [
  'flex h-8 w-full px-2.5 py-0.5 border border-neutral-300 rounded-md',
  'bg-neutral-100 text-neutral-800 placeholder:text-neutral-500',
  'hover:border-neutral-400',
  '[&:not(:active)]:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.05)]'
]


export function Input(props) {
  const [classes, rest] = splitProps(props, ['class'])
  return (
    <input class={cx(...defaultStyles, classes.class)}
      {...rest} />
  )
}
