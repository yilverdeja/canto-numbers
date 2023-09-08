import { defineStore } from 'pinia'

const getSavedHintType = () => {
    const value = localStorage.getItem("hint-type")
    return value ? value : "jyutping"
}

const getSavedShowHint = () => {
    const value = localStorage.getItem("show-hint")
    return value ? value == "show" : false
}

const availableHintTypes = ["jyutping", "yale", "traditional"]

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        hintType: getSavedHintType(),
        showHint: getSavedShowHint(),
    }),

    actions: {
        updateHintType(hintType: string) {
            if (availableHintTypes.includes(hintType)) {
                this.hintType = hintType
                localStorage.setItem("hint-type", this.hintType)
            }
        },
        toggleShowHint() {
            this.showHint = !this.showHint
            localStorage.setItem("show-hint", this.showHint ? "show" : "hide")
        }
    },
})
