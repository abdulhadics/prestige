"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Phone } from "lucide-react"
import Link from "next/link"
import { useRetell } from "@/hooks/use-retell"

export function Hero() {
    const { isCalling, toggleCall } = useRetell()

    return (
        <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/20 to-white">
            <div className="container mx-auto text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-primary-foreground font-semibold">Serving Montreal, Laval & Longueuil</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
                    Upgrade Your Home Comfort with <span className="text-primary">Confort Prestige</span>
                </h1>

                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Premium Heat Pumps, Furnaces, and Windows.
                    Get an instant quote today from Isabelle, our AI specialist.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={toggleCall}
                        className={`h-12 px-8 text-lg w-full sm:w-auto transition-all ${isCalling ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
                    >
                        {isCalling ? (
                            <>
                                <Phone className="mr-2 w-5 h-5" />
                                {isAgentSpeaking ? "Isabelle Speaking..." : "Listening..."}
                            </>
                        ) : (
                            <>
                                Speak to Isabelle
                                <Phone className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>

                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto text-primary border-primary hover:bg-primary/5" asChild>
                        <Link href="#services">
                            View Services
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>Instant Pricing</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
