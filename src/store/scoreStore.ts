import { defineStore } from 'pinia'

const getSavedTotal = () => {
    const value = localStorage.getItem("total")
    return value ? parseInt(value) : 0
}

const getSavedCorrect = () => {
    const value = localStorage.getItem("correct")
    return value ? parseInt(value) : 0
}

const getSavedMissed = () => {
    const value = localStorage.getItem("missed")
    return value ? parseInt(value) : 0
}


export const useScoreStore = defineStore('score', {
    state: () => ({
        total: getSavedTotal(),
        correct: getSavedCorrect(),
        missed: getSavedMissed()
    }),

    actions: {
        incrementCorrect() {
            this.correct += 1
            this.total += 1
            localStorage.setItem("total", this.total.toString())
            localStorage.setItem("correct", this.correct.toString())
        },
        incrementMissed() {
            this.missed += 1
            this.total += 1
            localStorage.setItem("total", this.total.toString())
            localStorage.setItem("missed", this.missed.toString())
        },
        reset() {
            this.total = 0
            this.correct = 0
            this.missed = 0
            localStorage.setItem("total", this.total.toString())
            localStorage.setItem("correct", this.correct.toString())
            localStorage.setItem("missed", this.missed.toString())
        }
    },
})
