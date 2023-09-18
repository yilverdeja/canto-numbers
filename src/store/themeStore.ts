import { defineStore } from 'pinia'

const getSavedTheme = () => {
    const value = localStorage.getItem("theme")
    return value ? value : "light"
}

const availableThemes = ["dark", "light"]

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: getSavedTheme()
    }),

    actions: {
        toggleTheme() {
            this.theme = this.theme === "light" ? "dark" : "light"
            localStorage.setItem("theme", this.theme)
        }
    },
})
