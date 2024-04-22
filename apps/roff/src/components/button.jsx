import { splitProps } from 'solid-js'

const baseStyles = 'inline-flex items-center justify-center gap-2 h-8 px-2 py-1 border border-neutral-300 rounded whitespace-nowrap font-medium bg-neutral-50 text-neutral-900 shadow-[0_1px_0_0_#d4d4d8]'
const hoverFocusStyles = 'hover:border-neutral-400 hover:bg-neutral-100 focus:border-neutral-400 focus:bg-neutral-100'
const activeStyles = 'active:shadow-none active:shadow-[inset_0_1.5px_0_0_#d4d4d8] active:border-neutral-300'
const focusVisibleNotActiveStyles = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'

const tw = [baseStyles, hoverFocusStyles, activeStyles, focusVisibleNotActiveStyles]

const variantStyles = {
  primary: 'bg-blue-700 text-white border-blue-700 hover:bg-blue-800 hover:border-blue-900 focus:bg-blue-800 focus:border-blue-900 active:shadow-[inset_0_1.5px_0_0_rgb(0,0,0,0.3)] active:border-blue-700'
}

export function Button(props) {
  const [classProps, variant, rest] = splitProps(props, ['class'], ['variant'])
  return (
    <button
      class={[...tw, variantStyles[variant.variant], classProps.class].join(' ')}
      {...rest} />
  )
}
