"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const retellWebClient = useRef<RetellWebClient | null>(null)

    useEffect(() => {
        // Initialize client on mount
        retellWebClient.current = new RetellWebClient()

        // Event Listeners
        retellWebClient.current.on("call_started", () => {
            console.log("Call started")
            setIsCalling(true)
        })

        retellWebClient.current.on("call_ended", () => {
            console.log("Call ended")
            setIsCalling(false)
            setIsAgentSpeaking(false)
        })

        retellWebClient.current.on("agent_start_talking", () => {
            setIsAgentSpeaking(true)
        })

        retellWebClient.current.on("agent_stop_talking", () => {
            setIsAgentSpeaking(false)
        })

        retellWebClient.current.on("error", (error) => {
            console.error("Retell Error:", error)
            alert("Voice Connection Error: " + (error.message || "Unknown error"))
            setIsCalling(false)
        })

        return () => {
            if (retellWebClient.current) {
                retellWebClient.current.stopCall()
            }
        }
    }, [])

    const toggleCall = async () => {
        if (isCalling) {
            retellWebClient.current?.stopCall()
        } else {
            try {
                // 1. Warm up Microphone & Permissions first
                // This prevents the browser from blocking the audio context
                console.log("Requesting microphone access...")
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                stream.getTracks().forEach(track => track.stop()) // Stop immediate use, just waking it up

                // 2. Get Access Token from our secure backend
                const response = await fetch("/api/register-call")

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()

                if (!data.access_token) throw new Error("No access token received from server")

                console.log("Starting call with token...")

                // 3. Start Call with minimal config
                await retellWebClient.current?.startCall({
                    accessToken: data.access_token,
                })

                // 4. Force Resume Audio Context (Fix for Chrome/Edge auto-play policy)
                // This wakes up the audio engine if the browser has put it to sleep
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    if (ctx.state === 'suspended') {
                        await ctx.resume();
                    }
                    ctx.close();
                }

                // 4. Force Resume Audio Context (Fix for Chrome auto-play policy)
                // We create a temporary context just to ensure the browser allows audio
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
        toggleCall,
    }
}
