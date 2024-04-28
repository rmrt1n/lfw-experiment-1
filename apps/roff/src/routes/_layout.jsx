import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Header } from "~/components/header";

export default function RootLayout(props) {
  return (
    <div class="min-h-screen">
      <Title>Rofobi</Title>
      <Header />
      <main class="max-w-5xl mx-auto p-2 py-10 h-[calc(100vh-4rem-1px)]">
        <Suspense fallback={Loading}>
          {props.children}
        </Suspense>
      </main>
    </div>
  )
}

function Loading() {
  return (
    <>
      Initializing app...
    </>
  )
}
