"use client"

import { useState, useEffect } from "react"
import { dbService } from "@/services/db-service"
import { CallLog } from "@/types/call"

export function useCalls() {
    const [calls, setCalls] = useState<CallLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCalls = async () => {
        try {
            setIsLoading(true)
            const data = await dbService.getCalls()
            setCalls(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchCalls()
    }, [])

    return {
        calls,
        isLoading,
        error,
        refresh: fetchCalls
    }
}
