import { Button, button } from '~/components/ui/button'
import { GitHub, Logo, Profile } from "~/components/ui/icons";
import { cx } from "~/lib/utils";
import { useFrain } from "~/lib/frain-provider";
import { createSignal } from 'solid-js';
import { Card } from '~/components/ui/card';

export function Header() {
  const [isOpen, setIsOpen] = createSignal(false)
  const db = useFrain()

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen())
  }

  const handleToggleOfflineMode = () => {
    db.setIsOnline(!db.isOnline())
    setIsOpen(false)
  }

  return (
    <header>
      <nav class="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2 h-16">
        <a href="/" class="flex items-center gap-2 font-extrabold text-lg">
          <Logo />
          Rofobi
        </a>
        <div class="flex items-center gap-2">
          {/* <a href="https://github.com" target="_blank" class={button()}> */}
          {/*   <GitHub /> */}
          {/*   GitHub */}
          {/* </a> */}
          <div class="relative">
            <Button onClick={handleToggleDropdown}>
              <div class={cx('size-3 border-2 rounded-full flex-shrink-0', db.isOnline() ? 'bg-green-500 border-green-600' : 'border-neutral-400')} />
              {db.isOnline() ? 'Online' : 'Offline'}
            </Button>
            <Show when={isOpen()}>
              <Card class="absolute right-0 mt-1 min-w-64 p-1">
                <div class="rounded hover:bg-neutral-200/75 px-2 py-1.5 cursor-default" onClick={handleToggleOfflineMode}>
                  {db.isOnline() ? 'Simulate offline-mode' : 'Disable offline-mode'}
                </div>
              </Card>
            </Show>
          </div>
          <Button><Profile /></Button>
          {/* <Button variant="primary">Sign in</Button> */}
        </div>
      </nav>
    </header>
  )
}
