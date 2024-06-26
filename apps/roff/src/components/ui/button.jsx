import { splitProps } from 'solid-js'
import { cx, cva } from '~/lib/utils'

export const button = cva({
  base: [
    'inline-flex items-center justify-center gap-2 flex-shrink-0',
    'border rounded-md ring-offset-1',
    'font-medium text-center no-underline align-center whitespace-nowrap leading-tight',
    '[&:not(:active)]:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.5)]',
    '[&:not(:disabled)]:active:shadow-[inset_0_2px_2px_0_rgba(0,0,0,0.05)]',
    'cursor-default disabled:cursor-not-allowed'
  ],
  variants: {
    variant: {
      default: [
        'bg-gradient-to-b from-neutral-50 to-neutral-100 border-neutral-300 text-neutral-800',
        '[&:not(:disabled)]:hover:border-neutral-400',
        '[&:not(:disabled)]:active:from-neutral-100 [&:not(:disabled)]:active:to-neutral-100 active:border-neutral-300',
        'disabled:text-neutral-500',
      ],
      primary: [
        'bg-gradient-to-b from-indigo-500 to-indigo-600 border-indigo-600 text-neutral-100',
        'hover:from-indigo-500/95 hover:to-indigo-600/95 hover:border-indigo-700',
        'active:from-indigo-600 active:to-indigo-600/95 active:border-indigo-600',
      ],
    },
    size: {
      default: 'h-8 px-2.5 py-0.5',
      icon: 'size-8'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export function Button(props) {
  const [classAndVariant, rest] = splitProps(props, ['class', 'variant', 'size'])
  return (
    <button
      class={cx(button(classAndVariant))}
      {...rest} />
  )
}
