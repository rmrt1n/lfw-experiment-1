import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";

export default function RootLayout(props) {
  return (
    <>
      <Title>Rofobi</Title>
      <header className="border-b h-10">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2">
          <a href="/">Rofobi</a>
          <div className="space-x-2">
            <button>GitHub</button>
            <button>Sign in</button>
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
