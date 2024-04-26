import { splitProps } from "solid-js"
import { cx } from '~/lib/utils'

const defaultStyles = [
  'rounded-md p-3 bg-neutral-50 border border-neutral-300 shadow-md'
]

export function Card(props) {
  const [classes, rest] = splitProps(props, ['class'])
  return (
    <div class={cx(...defaultStyles, classes.class)}
      {...rest} />
  )
}
