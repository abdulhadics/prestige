import { NextResponse } from "next/server"
import Retell from "retell-sdk"

export const dynamic = "force-dynamic" // Prevent caching of the token
export const runtime = "nodejs" // Ensure robust crypto availability

const apiKey = (process.env.RETELL_API_KEY || "").trim()
const retell = new Retell({
    apiKey: apiKey,
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const agent_id = (body.agent_id || process.env.RETELL_AGENT_ID || "").trim()

        console.log(`[API V2] Generating token for Agent: ${agent_id}`)
        console.log(`[API V2] Using API Key (last 4): ...${apiKey.slice(-4)}`)

        if (!agent_id) {
            return NextResponse.json(
                { error: "Missing agent_id in request body" },
                { status: 400 }
            )
        }

        const registerCallResponse = await retell.call.createWebCall({
            agent_id: agent_id,
        })

        return NextResponse.json(registerCallResponse, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        })
    } catch (error) {
        console.error("Error registering call:", error)
        return NextResponse.json(
            { error: "Failed to register call" },
            { status: 500 }
        )
    }
}
