import { CallTable } from "@/components/dashboard/call-table"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Call } from "@/types/database"

export const dynamic = "force-dynamic"


export default async function DashboardPage() {
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    // Fetch initial data
    const { data: calls } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Call Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time supervision of "Isabelle" agents.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wide">Live Connection</span>
                </div>
            </div>

            <CallTable initialCalls={(calls as Call[]) || []} />
        </div>
    )
}
