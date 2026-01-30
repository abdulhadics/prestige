"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

const agentId = "YOUR_AGENT_ID_HERE" // TODO: Replace with env var or client asset

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
                // 1. Get Access Token from our secure backend
                const response = await fetch("/api/register-call")

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()

                if (!data.access_token) throw new Error("No access token received from server")

                // 2. Start Call
                await retellWebClient.current?.startCall({
                    accessToken: data.access_token,
                })
            } catch (err) {
                console.error("Failed to start call:", err)
                if (err instanceof Error) {
                    alert("Failed to start call: " + err.message)
                } else {
                    alert("Failed to start call. Check console.")
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
