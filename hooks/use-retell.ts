"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)

    // Simplest possible ref management
    const retellWebClient = useRef<RetellWebClient | null>(null)

    useEffect(() => {
        // Cleanup only
        return () => {
            retellWebClient.current?.stopCall()
        }
    }, [])

    const toggleCall = async () => {
        if (isCalling) {
            retellWebClient.current?.stopCall()
            setIsCalling(false)
            return
        }

        try {
            // 1. Create Client
            const client = new RetellWebClient()
            retellWebClient.current = client

            // 2. Setup Listeners
            client.on("call_started", () => {
                console.log("Call started")
                setIsCalling(true)
            })
            client.on("call_ended", () => {
                console.log("Call ended")
                setIsCalling(false)
                setIsAgentSpeaking(false)
            })
            client.on("agent_start_talking", () => setIsAgentSpeaking(true))
            client.on("agent_stop_talking", () => setIsAgentSpeaking(false))
            client.on("error", (err) => {
                console.error("Retell Error:", err)
                if (!err.message?.includes("closed")) {
                    alert("Error: " + err.message)
                }
                setIsCalling(false)
            })

            // 3. Get Token (Renamed Route to force update)
            console.log("Fetching token from NEW route...")
            const response = await fetch(`/api/get-voice-token?t=${Date.now()}&r=${Math.random()}`, {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Pragma": "no-cache"
                }
            })
            if (!response.ok) throw new Error("API Error")
            const data = await response.json()

            // 4. Start (Defaults Only)
            await client.startCall({
                accessToken: data.access_token,
            })

        } catch (err: any) {
            console.error("Setup Error", err)
            alert("Could not connect: " + err.message)
            setIsCalling(false)
        }
    }

    return {
        isCalling,
        isAgentSpeaking,
        toggleCall,
    }
}
