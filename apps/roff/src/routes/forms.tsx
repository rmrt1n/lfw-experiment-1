import { FrainProvider } from "~/lib/frain-provider";

export default function FormsLayout(props) {
  return (
    <FrainProvider>
      {props.children}
    </FrainProvider>
  )
}
