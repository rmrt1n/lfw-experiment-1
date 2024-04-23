import { Title } from "@solidjs/meta";
import { Button } from '~/components/button'

export default function RootLayout(props) {
  return (
    <>
      <Title>Rofobi</Title>
      <header className="border-b h-12">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2">
          <a href="/">Rofobi</a>
          <div className="flex items-center gap-2">
            <a href="https://github.com">GitHub</a>
            <Button variant="primary">Sign in</Button>
          </div>
        </nav>
      </header>
      <main class="max-w-5xl mx-auto p-2 pt-10">
        {props.children}
      </main>
    </>
  )
}
