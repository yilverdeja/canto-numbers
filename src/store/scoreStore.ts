import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', {
    state: () => ({
        total: 0,
        correct: [],
        missed: []
    }),

    actions: {
        resetScore() {
            this.total = 0
            this.correct = []
            this.missed = []
        },
        addToCorrect(val: string) {
            this.correct.push(val)
            this.total += 1
        },
        addToMissed(val: string) {
            this.missed.push(val)
            this.total += 1
        },
    },
})
