import { onMount, onCleanup } from "solid-js"
import { Button } from "~/components/button"

export default function Home() {
  let ws;

  onMount(() => {
    const host = window.location.host
    ws = new WebSocket(`ws://${host}/_sync`)

    // TODO: init client & sync on open
    ws.onopen = () => console.log('connected')
    ws.onmessage = (event) => console.log(event.data)

    onCleanup(() => {
      ws.close()
    })
  })

  const pong = () => {
    ws.send('ping')
  }

  return (
    <Button onClick={pong}>Ping</Button>
  )
}
