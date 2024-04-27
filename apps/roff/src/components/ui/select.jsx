import { splitProps, children } from "solid-js"
import { cx } from '~/lib/utils'

const defaultStyles = [
  'flex h-8 w-full px-2.5 py-0.5 border border-neutral-300 rounded-md',
  'bg-neutral-100 text-neutral-800 placeholder:text-neutral-500',
  'hover:border-neutral-400',
  '[&:not(:active)]:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.05)]'
]


export function Select(props) {
  const [classes, rest] = splitProps(props, ['class'])
  const options = () => children(() => rest.children).toArray()

  return (
    <select
      class={cx(...defaultStyles, classes.class)}
      {...rest}
    >
      <For each={options()}>
        {(option) => (
          <option
            value={option.value}
            selected={option.value === props.value}
          >
            {option.children}
          </option>
        )}
      </For>
    </select>
  )
}

export function SelectOption(props) {
  return props
}
