import { NextResponse } from "next/server"
import Retell from "retell-sdk"

export const dynamic = "force-dynamic" // Prevent caching of the token

const retell = new Retell({
    apiKey: process.env.RETELL_API_KEY || "key_placeholder",
})

export async function POST() {
    try {
        const agentId = process.env.RETELL_AGENT_ID;

        if (!agentId) {
            throw new Error("Missing RETELL_AGENT_ID");
        }

        const registerCallResponse = await retell.call.createWebCall({
            agent_id: agentId,
        })

        return NextResponse.json(registerCallResponse)
    } catch (error) {
        console.error("Error registering call:", error)
        return NextResponse.json(
            { error: "Failed to register call" },
            { status: 500 }
        )
    }
}
