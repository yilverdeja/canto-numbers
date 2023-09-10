import { defineStore } from 'pinia'

const getSavedSessions = () => {
    const value = localStorage.getItem("sessions")
    return value ? JSON.parse(value) : []
}

export const useStatsStore = defineStore('stats', {
    state: () => ({
        sessions: getSavedSessions()
    }),

    actions: {
        addSession(correct: Array<number>, missed: Array<number>, total: number, type: string, options: Object, start_at: Date, end_at: Date) {
            const session = {
                correct: correct,
                missed: missed,
                total: total,
                type: type,
                options: options,
                start_at: start_at,
                end_at: end_at
            }
            this.sessions.push(session)
            console.log(this.sessions)
            localStorage.setItem("sessions", JSON.stringify(this.sessions))
        },
        removeSessionAtIndex(index: number) {
            this.sessions.splice(index, 1)
            localStorage.setItem("sessions", JSON.stringify(this.sessions))
        },
        reset() {
            this.sessions = []
            localStorage.setItem("sessions", JSON.stringify(this.sessions))
        }
    },
})
