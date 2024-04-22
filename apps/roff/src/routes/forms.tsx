import { FrainProvider } from "~/lib/frain-provider";

import { clientOnly } from "@solidjs/start"

const ClientOnlyFrainProvider = clientOnly(() => Promise.resolve({ default: FrainProvider }))

export default function FormsLayout(props) {
  return (
    <ClientOnlyFrainProvider>
      {props.children}
    </ClientOnlyFrainProvider>
  )
}
