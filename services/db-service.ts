import { supabase } from "@/lib/supabase"
import { CallLog } from "@/types/call"

export const dbService = {
    async getCalls() {
        // Fetch calls ordered by most recent
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching calls:', error)
            throw error
        }

        return data as CallLog[]
    },

    async getCallById(callId: string) {
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .eq('call_id', callId)
            .single()

        if (error) throw error
        return data as CallLog
    }
}
