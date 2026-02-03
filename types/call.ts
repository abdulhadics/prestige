export interface CallLog {
    id?: number
    call_id: string
    caller_number: string
    transcript: string
    summary: string | null
    lead_score: number
    status: 'New' | 'Qualified' | 'Urgent' | 'Spam'
    recording_url: string | null
    created_at?: string
}
