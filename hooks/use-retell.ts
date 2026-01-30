"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [debugLog, setDebugLog] = useState<string[]>([]) // Visible Debug Log
    const retellWebClient = useRef<RetellWebClient | null>(null)

    const addLog = (msg: string) => {
        console.log("UseRetell:", msg)
        setDebugLog(prev => [...prev.slice(-4), msg]) // Keep last 5 messages
    }

    useEffect(() => {
        try {
            retellWebClient.current = new RetellWebClient()
            addLog("SDK Initialized")
        } catch (e: any) {
            addLog("SDK Init Failed: " + e.message)
        }

        retellWebClient.current?.on("call_started", () => {
            addLog("Event: Call Started")
            setIsCalling(true)
            setIsConnecting(false)
        })

        retellWebClient.current?.on("call_ended", () => {
            addLog("Event: Call Ended")
            setIsCalling(false)
            setIsAgentSpeaking(false)
            setIsConnecting(false)
        })

        retellWebClient.current?.on("agent_start_talking", () => {
            // Don't spam logs with talking
            setIsAgentSpeaking(true)
        })

        retellWebClient.current?.on("agent_stop_talking", () => {
            setIsAgentSpeaking(false)
        })

        retellWebClient.current?.on("error", (error) => {
            addLog("Event: Error - " + error.message)
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
        if (isConnecting) return;

        if (isCalling) {
            addLog("Stopping Call...")
            setIsConnecting(true)
            retellWebClient.current?.stopCall()
        } else {
            setIsConnecting(true)
            setDebugLog([]) // Clear logs on new call
            addLog("Starting Connection...")

            try {
                // 1. Get Access Token
                const response = await fetch("/api/register-call")
                if (!response.ok) throw new Error("API " + response.status)

                const data = await response.json()
                addLog("Token Received")

                if (!data.access_token) throw new Error("No Token")

                // 2. Start Call
                addLog("Starting SDK Call...")
                await retellWebClient.current?.startCall({
                    accessToken: data.access_token,
                    sampleRate: 24000,
                })

                // 3. Audio Wakeup
                addLog("Waking Audio Context...")
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    const ctx = new AudioContext();
                    if (ctx.state === 'suspended') {
                        await ctx.resume();
                        addLog("Audio Context Resumed")
                    }
                    ctx.close();
                } else {
                    addLog("No Audio Context Found")
                }

            } catch (err: any) {
                addLog("Error: " + err.message)
                setIsConnecting(false)
                setIsCalling(false)
            }
        }
    }

    return {
        isCalling,
        isAgentSpeaking,
        isConnecting,
        toggleCall,
        debugLog // Export logs
    }
}
