import { splitProps } from "solid-js"

export function Button(props) {
  const [, rest] = splitProps(props, ['class'])
  return (
    <button
      class="inline-flex items-center justify-center gap-2 h-8 px-2 py-1 border rounded"
      {...rest} />
  )
}
