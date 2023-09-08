<script setup lang="ts">
/* IMPORTS & CONSTANTS */
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()

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

// settings store
import { useSettingsStore } from '@/store/settingsStore';
const settingsStore = useSettingsStore()
const { updateHintType, toggleShowHint } = settingsStore
const { hintType, showHint } = storeToRefs(settingsStore)

/* FUNCTIONS */
const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        start()
    }
}, 100)

const start = () => {
    let minVal = 0
    let maxVal = 10
    if (category.value == "hard") {
        minVal = 100
        maxVal = 1000
    } else if (category.value == "medium") {
        maxVal = 100
    }
    router.push({path: "/play", query: {min: minVal, max: maxVal}})
}

const goToPractice = debounce((event) => {
    if (event.key == "p") {
        practice()
    }
}, 100)

const practice = () => {
    router.push("/practice")
}

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keypress", goToPractice)
    window.addEventListener("keydown", toggleGameRun)
})

onUnmounted(() => {
    window.removeEventListener("keypress", goToPractice)
    window.removeEventListener("keydown", toggleGameRun)
})

const category = ref("easy")

// https://www.tutorialspoint.com/how-to-fix-property-not-existing-on-eventtarget-in-typescript
const changeHintType = (event: Event) => {
    if (event.target) {
        const eventValue = (event.target as HTMLInputElement).value
        updateHintType(eventValue)
    }
}

const changeHintShow = (event: Event) => {
    if (event.target) {
        toggleShowHint()
    }
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <!-- instructions -->
            <div>
                <h1 class="text-5xl md:text-6xl py-4">Canto Numbers</h1>
                <div class="grid md:grid-cols-2 gap-0 md:gap-6">
                    <!-- instructions -->
                    <div class="text-xl md:text-2xl font-light">
                        <p class="py-2"><span class="font-medium">About: </span>Learn to distinguish numbers in Cantonese by listening</p>
                        <p class="py-2"><span class="font-medium">How to play: </span>Type in the number you hear, and submit it to see if the guess is correct or not</p>
                        <p class="py-2"><span class="font-medium">Sounds: </span>Get aquainted to the correct and wrong sound effects</p>
                        <div class="grid grid-cols-2 gap-6">
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="playCorrect">correct</button>
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="playWrong">wrong</button>
                        </div>
                    </div>

                    <!-- controls -->
                    <div class="text-xl md:text-2xl font-light">
                        <!-- <div>
                            <label class="text-xl md:text-2xl font-medium">Hint:</label>
                            <select :value="hintType" class="text-xl md:text-2xl font-light rounded-md bg-slate-100 hover:bg-slate-200 border-none px-8 py-2 my-4 mx-4 appearance-none" @change="changeHintType">
                                <option value="jyutping">Jyutping</option>
                                <option value="yale">Yale</option>
                                <option value="traditional">Chinese</option>
                            </select>

                            <label class="text-xl md:text-2xl font-medium">Show: </label>
                            <input class="p-2 rounded-md" type="checkbox" :checked="showHint" @change="changeHintShow" />
                        </div> -->
                        <div class="hidden md:block ">
                            <p class="py-2"><span class="font-medium">Controls: </span>Use the following keyboard controls for ease of use</p>
                            <ul class="list-disc list-inside">
                                <li>Space: Play / Pause Game</li>
                                <li>Enter: Submit Guess</li>
                                <li>R: Replay Audio</li>
                                <li>H: Hint in Jyutping</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="text-xl md:text-2xl font-medium">Category:</label>
                    <select v-model="category" class="text-xl md:text-2xl font-light rounded-md bg-slate-100 hover:bg-slate-200 border-none px-8 py-2 my-4 mx-4 appearance-none">
                        <option value="easy">0 to 10</option>
                        <option value="medium">0 to 100</option>
                        <option value="hard">100 to 1000</option>
                    </select>
                </div>
                <div class="flex flex-col md:flex-row text-center justify-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="start">start <span class="hidden md:inline-block">(space)</span></button>
                    <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="practice">practice <span class="hidden md:inline-block">(p)</span></button>
                </div>
            </div>
        </div>
        <PageFooter />
    </div>
</template>
