"use client"

import { useState } from "react"
import { useCalls } from "@/hooks/use-calls"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"
import { Play, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TranscriptViewer } from "./transcript-viewer"
import type { CallLog } from "@/types/call"

export function CallTable() {
    const { calls, isLoading } = useCalls()
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)

    const handleViewTranscript = (call: CallLog) => {
        setSelectedCall(call)
        setIsTranscriptOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg border">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700">Score</TableHead>
                            <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                            <TableHead className="font-semibold text-slate-700">Summary</TableHead>
                            <TableHead className="font-semibold text-slate-700">Time</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.id || call.call_id || Math.random()} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <Badge variant={
                                        call.status === 'Urgent' ? 'destructive' :
                                            call.status === 'Qualified' ? 'default' : 'secondary'
                                    }>
                                        {call.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium w-6">{call.lead_score}</span>
                                        <Progress value={call.lead_score || 0} className="w-16 h-2 bg-slate-100" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">{call.caller_number}</TableCell>
                                <TableCell className="max-w-md truncate text-slate-500" title={call.summary || ""}>
                                    {call.summary || "Processing..."}
                                </TableCell>
                                <TableCell className="text-slate-500 whitespace-nowrap text-sm">
                                    {call.created_at ? formatDistanceToNow(new Date(call.created_at), { addSuffix: true }) : 'Just now'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleViewTranscript(call)}
                                            title="View Transcript"
                                        >
                                            <FileText className="h-4 w-4 text-slate-500" />
                                        </Button>
                                        {call.recording_url && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => window.open(call.recording_url || "", "_blank")}
                                                title="Play Recording"
                                            >
                                                <Play className="h-4 w-4 text-indigo-500" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {calls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-400">
                                    No calls found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TranscriptViewer
                call={selectedCall}
                open={isTranscriptOpen}
                onOpenChange={setIsTranscriptOpen}
            />
        </>
    )
}
