"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <Card className="w-full max-w-md border shadow-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Admin Login
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Confort Prestige Command Center
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none text-slate-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@confortprestige.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border-slate-200 focus-visible:ring-primary h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none text-slate-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white border-slate-200 focus-visible:ring-primary h-11"
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md h-11 font-semibold transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Access Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
