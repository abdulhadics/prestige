"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignOutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        setIsLoading(true)
        const supabase = createClient()

        await supabase.auth.signOut()

        router.refresh()
        router.push("/login")
        setIsLoading(false)
    }

    return (
        <Button
            variant="ghost"
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="h-4 w-4" />
            )}
            Sign Out
        </Button>
    )
}
