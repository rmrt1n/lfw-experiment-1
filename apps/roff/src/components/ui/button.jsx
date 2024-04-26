import { splitProps } from 'solid-js'
import { cx, cva } from '~/lib/utils'

export const button = cva({
  base: [
    'inline-flex items-center justify-center gap-2 flex-shrink-0',
    'h-8 px-2.5 py-0.5 border rounded-md ring-offset-1',
    'font-medium text-center no-underline align-center whitespace-nowrap leading-tight',
    '[&:not(:active)]:shadow-sm active:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.06);]',
    'cursor-default'
  ],
  variants: {
    variant: {
      default: [
        'bg-gradient-to-b from-neutral-50 to-neutral-100 border-neutral-300 text-neutral-800',
        'hover:border-neutral-400',
        'active:from-neutral-100 active:to-neutral-100 active:border-neutral-300'
      ],
      primary: [
        'bg-gradient-to-b from-indigo-500 to-indigo-600 border-indigo-600 text-neutral-100',
        'hover:from-indigo-500/95 hover:to-indigo-600/95 hover:border-indigo-800',
        'active:from-indigo-600 active:to-indigo-600/95 active:border-indigo-600'
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Button(props) {
  const [classAndVariant, rest] = splitProps(props, ['class', 'variant'])
  return (
    <button
      class={cx(button(classAndVariant))}
      {...rest} />
  )
}
