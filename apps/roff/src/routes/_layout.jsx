import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Button, button } from '~/components/button'
import { GitHub, Logo, Profile } from "~/components/icons";

export default function RootLayout(props) {
  return (
    <>
      <Title>Rofobi</Title>
      <header>
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2 h-16">
          <a href="/" class="flex items-center gap-2 font-extrabold text-lg">
            <Logo />
            Rofobi
          </a>
          <div className="flex items-center gap-2">
            <a href="https://github.com" target="_blank" class={button()}>
              <GitHub />
              GitHub
            </a>
            <Button><Profile /></Button>
            {/* <Button variant="primary">Sign in</Button> */}
          </div>
        </nav>
      </header>
      <main class="max-w-5xl mx-auto p-2 pt-10">
        <Suspense fallback={Loading}>
          {props.children}
        </Suspense>
      </main>
    </>
  )
}

function Loading() {
  return (
    <>
      Initializing app...
    </>
  )
}
