<script setup lang="ts">
/* IMPORTS & CONSTANTS */
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()
const type = route.name?.toString()

useHead({
  title: route.meta.title,
  meta: [
    {
      property: 'og:title',
      content: route.meta.title,
    },
    {
      name: 'twitter:title',
      content: route.meta.title,
    },
  ],
})

// sound
import { useSound } from "@vueuse/sound"
import correctSfx from "@/assets/audio/correct.mp3"
import wrongSfx from "@/assets/audio/wrong.mp3"

// sound effects
const { play: playCorrect } = useSound(correctSfx)
const { play: playWrong } = useSound(wrongSfx)

/* FUNCTIONS */
const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        start()
    }
}, 100)

const start = () => {
    if (type == "integers") {
        let minVal = 0
        let maxVal = 10
        if (selected.value == "hard") {
            minVal = 100
            maxVal = 1000
        } else if (selected.value == "medium") {
            maxVal = 100
        }
        router.push({path: `/${type}/play`, query: {min: minVal, max: maxVal}})
    } else if (type == "time") {
        let minHour = 1
        let maxHour = 12
        let minMinute = 0
        let maxMinute = 0
        if (selected.value == "hard") {
            minHour = 1
            maxHour = 12
            minMinute = 0
            maxMinute = 59
        } else if (selected.value == "medium") {
            minHour = 1
            maxHour = 12
            minMinute = 30
            maxMinute = 30
        }
        router.push({path: `/${type}/play`, query: {minHour: minHour, maxHour: maxHour, minMinute: minMinute, maxMinute: maxMinute}})
    }

    
}

const handleKeyPresses = debounce((event) => {
    if (event.key == "p") {
        practice()
    } else if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

const practice = () => {
    router.push(`/${type}/practice`)
}

const stats = () => {
    router.push("/stats")
}

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
    window.addEventListener("keydown", toggleGameRun)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
    window.removeEventListener("keydown", toggleGameRun)
})

// const category = ref("easy")

const selected = ref("")
const options = ref([{}])

if (type == "integers") {
    selected.value = "easy"
    options.value = [
        {text: "0 to 10", value: "easy"},
        {text: "0 to 100", value: "medium"},
        {text: "100 to 1000", value: "hard"}
    ]
} else if (type == "time") {
    selected.value = "easy"
    options.value = [
        {text: "Hours", value: "easy"},
        {text: "Half Hours", value: "medium"},
        {text: "All", value: "hard"}
    ]
} else if (type == "money") {

}

const modalOpen = ref(false)

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <!-- instructions -->
            <div>
                <h1 class="text-5xl md:text-6xl py-4">Canto {{ type }}</h1>
                <div class="grid md:grid-cols-2 gap-0 md:gap-6">
                    <!-- instructions -->
                    <div class="text-xl md:text-2xl font-light">
                        <p class="py-2"><span class="font-medium">About: </span>Learn to distinguish {{ type }} in Cantonese by listening</p>
                        <p class="py-2"><span class="font-medium">How to play: </span>Type in the {{ type }} you hear, and submit it to see if the guess is correct or not</p>
                    </div>
                </div>
                
                <div>
                    <label class="text-xl md:text-2xl font-medium">Category:</label>
                    <select v-model="selected" class="text-xl md:text-2xl font-light rounded-md bg-slate-100 hover:bg-slate-200 border-none px-8 py-2 my-4 mx-4 appearance-none">
                        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
                    </select>
                </div>
                <div class="flex flex-col md:flex-row text-center justify-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="start">Start</button>
                    <div class="flex flex-row justify-between">
                        <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="practice">Practice</button>
                        <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="stats">Stats</button>
                    </div>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
        <PageFooter />
    </div>
</template>
