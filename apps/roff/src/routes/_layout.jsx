import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Header } from "~/components/header";

export default function RootLayout(props) {

  return (
    <>
      <Title>Rofobi</Title>
      <Header />
      <main class="max-w-5xl mx-auto p-2 py-10">
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
