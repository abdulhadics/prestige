"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const retellWebClient = useRef<RetellWebClient | null>(null)

    useEffect(() => {
        // Initialize client on mount
        try {
            retellWebClient.current = new RetellWebClient()
        } catch (e) {
            console.error("Client Init Failed", e)
        }

        // Event Listeners
        retellWebClient.current?.on("call_started", () => {
            console.log("Call started")
            setIsCalling(true)
            setIsConnecting(false)
        })

        retellWebClient.current?.on("call_ended", () => {
            console.log("Call ended")
            setIsCalling(false)
            setIsAgentSpeaking(false)
            setIsConnecting(false)
        })

        retellWebClient.current?.on("agent_start_talking", () => {
            setIsAgentSpeaking(true)
        })

        retellWebClient.current?.on("agent_stop_talking", () => {
            setIsAgentSpeaking(false)
        })

        retellWebClient.current?.on("error", (error) => {
            console.error("Retell Error:", error)
            alert("Voice Connection Error: " + (error.message || "Unknown error"))
            setIsCalling(false)
            setIsConnecting(false)
        })

        return () => {
            if (retellWebClient.current) {
                retellWebClient.current.stopCall()
            }
        }
    }, [])

    const toggleCall = async () => {
        if (isConnecting) return; // Prevent double clicks

        if (isCalling) {
            setIsConnecting(true)
            retellWebClient.current?.stopCall()
        } else {
            setIsConnecting(true)
            try {
                // 1. Get Access Token
                const response = await fetch("/api/register-call")

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()

                if (!data.access_token) throw new Error("No access token received from server")

                // 2. Start Call
                await retellWebClient.current?.startCall({
                    accessToken: data.access_token,
                    sampleRate: 24000,
                })

                // 3. Force Resume Audio Context (Fix for Chrome/Edge auto-play policy)
                // This wakes up the audio engine if the browser has put it to sleep
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
                } else {
                    alert("Call Failed. Check console.")
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
