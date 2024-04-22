import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Button } from '~/components/button'

export default function RootLayout(props) {
  return (
    <>
      <Title>Rofobi</Title>
      <header className="border-b h-12">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2">
          <a href="/">Rofobi</a>
          <div className="flex items-center gap-2">
            <button>GitHub</button>
            <Button variant="primary">Sign in</Button>
          </div>
        </nav>
      </header>
      <main class="max-w-5xl mx-auto p-2">
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
