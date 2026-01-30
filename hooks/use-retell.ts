"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const retellWebClient = useRef<RetellWebClient | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retellWebClient.current) {
                retellWebClient.current.stopCall()
            }
        }
    }, [])

    const toggleCall = async () => {
        if (isConnecting) return;

        if (isCalling) {
            setIsConnecting(true)
            retellWebClient.current?.stopCall()
            // Reset state immediately on stop request
            // Listener will cleanup the rest, but we assume stopping
            setIsConnecting(false)
        } else {
            setIsConnecting(true)
            try {
                // ALWAYS Create a Fresh Client for every call
                // This prevents "Zombie" states where the previous call didn't clean up
                const client = new RetellWebClient()
                retellWebClient.current = client

                // Attach Listeners to this new client
                client.on("call_started", () => {
                    console.log("Call started")
                    setIsCalling(true)
                    setIsConnecting(false)
                })

                client.on("call_ended", () => {
                    console.log("Call ended")
                    setIsCalling(false)
                    setIsAgentSpeaking(false)
                    setIsConnecting(false)
                    // Nuke the client reference to be safe
                    retellWebClient.current = null
                })

                client.on("agent_start_talking", () => {
                    setIsAgentSpeaking(true)
                })

                client.on("agent_stop_talking", () => {
                    setIsAgentSpeaking(false)
                })

                client.on("error", (error) => {
                    console.error("Retell Error:", error)
                    alert("Voice Connection Error: " + (error.message || "Unknown error"))
                    setIsCalling(false)
                    setIsConnecting(false)
                    retellWebClient.current = null
                })

                // 1. Get Access Token
                const response = await fetch("/api/register-call")
                if (!response.ok) throw new Error(`API Error: ${response.status}`)
                const data = await response.json()
                if (!data.access_token) throw new Error("No access token")

                // 2. Start Call
                await client.startCall({
                    accessToken: data.access_token,
                    sampleRate: 24000,
                })

                // 3. Audio Wakeup
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    if (ctx.state === 'suspended') {
                        await ctx.resume();
                    }
                    ctx.close();
                }

            } catch (err) {
                console.error("Failed to start call:", err)
                setIsConnecting(false)
                setIsCalling(false)
                if (err instanceof Error) {
                    alert("Call Failed: " + err.message)
                }
            }
        }
    }

    return {
        isCalling,
        isAgentSpeaking,
        isConnecting,
        toggleCall,
    }
}
