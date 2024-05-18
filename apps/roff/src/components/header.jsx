import { Button, button } from '~/components/ui/button'
import { GitHub, Logo, Profile } from "~/components/ui/icons";
import { cx } from "~/lib/utils";
import { useFrain } from "~/lib/frain-provider";
import { Match, createSignal } from 'solid-js';
import { Card } from '~/components/ui/card';
import { useWallet } from '~/lib/wallet-provider';

export function Header() {
  const { connect, disconnect, isConnected } = useWallet()
  const [isOfflineDropdownOpen, setIsOfflineDropdownOpen] = createSignal(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = createSignal(false)
  const db = useFrain()

  const handleToggleOfflineMode = () => {
    db.setIsOnline(!db.isOnline())
    setIsOfflineDropdownOpen(false)
  }
  console.log('the fuck', isConnected())

  return (
    <header>
      <nav class="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2 h-16">
        <a href="/" class="flex items-center gap-2 font-extrabold text-lg">
          <Logo />
          Rofobi
        </a>
        <div class="flex items-center gap-2">
          <Switch>
            <Match when={!isConnected()}>
              <a href="https://github.com" target="_blank" class={button()}>
                <GitHub />
                GitHub
              </a>
              <Button variant="primary" onClick={connect}>Sign in</Button>
            </Match>
            <Match when={isConnected()}>
              <div class="relative">
                <Button onClick={() => setIsOfflineDropdownOpen(!isOfflineDropdownOpen())}>
                  <div class={cx('size-3 border-2 rounded-full flex-shrink-0', db.isOnline() ? 'bg-green-500 border-green-600' : 'border-neutral-400')} />
                  {db.isOnline() ? 'Online' : 'Offline'}
                </Button>
                <Show when={isOfflineDropdownOpen()}>
                  <Card class="absolute right-0 mt-1 min-w-64 p-1">
                    <div onClick={handleToggleOfflineMode} class="rounded hover:bg-neutral-200/75 px-2 py-1.5 cursor-default">
                      {db.isOnline() ? 'Simulate offline-mode' : 'Disable offline-mode'}
                    </div>
                  </Card>
                </Show>
              </div>
              <div class="relative">
                <Button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen())}><Profile /></Button>
                <Show when={isProfileDropdownOpen()}>
                  <Card class="absolute right-0 mt-1 min-w-64 p-1">
                    <div onClick={() => { disconnect().then(() => setIsProfileDropdownOpen(false)) }} class="rounded hover:bg-neutral-200/75 px-2 py-1.5 cursor-default">
                      Sign out
                    </div>
                  </Card>
                </Show>
              </div>
            </Match>
          </Switch>
        </div>
      </nav>
    </header>
  )
}
