import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import { useState } from "react"
import { signAsync } from "@noble/ed25519"

export function SignMessage(privateKey : string) {
    const [message, setMessage] = useState("")
  return (
    <div>
        <Textarea placeholder="Type your message here." value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={async() => {
            const signMessage = await signAsync(message, privateKey)
            console.log("sign message ", signMessage)
        }}>Sign</Button>
    </div>
  )
}
