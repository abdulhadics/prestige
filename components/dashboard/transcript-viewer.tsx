"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { CallLog } from "@/types/call"
import { formatDistanceToNow } from "date-fns"

interface TranscriptViewerProps {
    call: CallLog | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TranscriptViewer({ call, open, onOpenChange }: TranscriptViewerProps) {
    if (!call) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <DialogTitle>Call Transcript</DialogTitle>
                        <Badge variant={call.status === 'Urgent' ? 'destructive' : 'secondary'}>
                            {call.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        {call.caller_number} • {call.created_at ? formatDistanceToNow(new Date(call.created_at), { addSuffix: true }) : ''}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto border rounded-md p-4 bg-slate-50 mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-mono">
                    {call.transcript || "No transcript available for this call."}
                </div>

                <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 mt-2 border border-blue-100">
                    <strong>AI Summary:</strong> {call.summary || "Pending analysis..."}
                </div>
            </DialogContent>
        </Dialog>
    )
}
