import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router"
import { useWallet } from "~/lib/wallet-provider";

export default function Home() {
  const navigate = useNavigate()
  const { isConnected } = useWallet()

  createEffect(() => {
    if (isConnected()) navigate('/forms')
  })

  return (
    <div class="overflow-x-hidden h-full">
      <h1 class="text-7xl font-extrabold text-center inline-block w-full scale-x-[3] scale-y-[2] mt-8 font-serif">ROFOBI</h1>
    </div>
  )
}
