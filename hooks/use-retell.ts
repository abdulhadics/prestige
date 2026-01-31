"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)

    // We use a ref to hold the client instance so it persists between renders
    // but we will re-instantiate it for each call to ensure a fresh clean state.
    const retellWebClient = useRef<RetellWebClient | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retellWebClient.current) {
                retellWebClient.current.stopCall()
                retellWebClient.current = null
            }
        }
    }, [])

    const toggleCall = async () => {
        if (isConnecting) return

        if (isCalling) {
            // STOPPING THE CALL
            setIsConnecting(true)
            console.log("Stopping call...")
            retellWebClient.current?.stopCall()
            // We rely on the 'call_ended' listener to reset state
        } else {
            // STARTING THE CALL
            setIsConnecting(true)
            try {
                // 1. Always create a fresh client instance to avoid stale state (User Not Joined error)
                if (retellWebClient.current) {
                    // Safety cleanup if somehow one exists
                    retellWebClient.current.stopCall()
                }

                const client = new RetellWebClient()
                retellWebClient.current = client

                // 2. Setup Event Listeners for this specific instance
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
                })

                client.on("agent_start_talking", () => {
                    setIsAgentSpeaking(true)
                })

                client.on("agent_stop_talking", () => {
                    setIsAgentSpeaking(false)
                })

                client.on("error", (error) => {
                    console.error("Retell Error:", error)
                    // Only alert if it's a real error, not just a close event
                    if (error.message && !error.message.includes("closed")) {
                        alert("Voice Connection Error: " + error.message)
                    }
                    setIsCalling(false)
                    setIsConnecting(false)
                })

                // 3. Get Access Token
                console.log("Fetching token...")
                const response = await fetch("/api/register-call")
                if (!response.ok) throw new Error(`API Error: ${response.status}`)
                const data = await response.json()
                if (!data.access_token) throw new Error("No access token")

                // 4. Start the Call
                console.log("Starting SDK...")
                await client.startCall({
                    accessToken: data.access_token,
                    sampleRate: 24000,
                })

                // 5. Minimal Audio Context Wakeup (Just in case)
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext
                if (AudioContext) {
                    const ctx = new AudioContext()
                    if (ctx.state === 'suspended') await ctx.resume()
                    ctx.close()
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
