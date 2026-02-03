"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalls } from "@/hooks/use-calls"
import { useMemo } from "react"
import { format } from "date-fns"

export function LeadScoreChart() {
    const { calls } = useCalls()

    // Process data for chart
    const data = useMemo(() => {
        // 1. Sort by date (oldest first for line chart)
        // 2. Map to simplified object
        return [...calls]
            .reverse() // calls are desc, we want asc for graph
            .map(call => ({
                time: format(new Date(call.created_at || new Date()), "HH:mm"),
                score: call.lead_score || 0,
                status: call.status
            }))
            // Take last 20 calls only to keep graph readable
            .slice(-20)
    }, [calls])

    if (calls.length < 2) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lead Quality Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
                    Not enough data to display trend.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lead Quality Trend (Last 20 Calls)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: "#10b981" }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
