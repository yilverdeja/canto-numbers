<script setup lang="ts">
/* IMPORTS & CONSTANTS */
import { storeToRefs } from 'pinia'
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

// score store
import { useScoreStore } from "@/store/scoreStore"
const scoreStore = useScoreStore()
const { addToCorrect, addToMissed, resetScore } = scoreStore
const { total, correct, missed } = storeToRefs(scoreStore)

// stats store
import { useStatsStore } from "@/store/statsStore"
const statsStore = useStatsStore()
const { addSession } = statsStore

// settings store
import { useSettingsStore } from '@/store/settingsStore';
const settingsStore = useSettingsStore()
const { hintType, showHint: forceShowHint } = storeToRefs(settingsStore)

watch([hintType, forceShowHint], ([newHintType, newForceShowHint]) => {
    showHint.value = newForceShowHint
})

// variables
const showHint = ref(forceShowHint.value)
const answerVal = ref("answer")
const answer = ref("?")

/* GAME FUNCTIONS */

const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        pause()
        if (!forceShowHint.value) showHint.value = false
    }
}, 100)

const repeatAudio = () => {
    if (childRef.value) childRef.value.play()
}

const handleShortcuts = debounce((event) => {
    if (event.key == "r") {
        repeatAudio()
    } else if (event.key == "h") {
        showHint.value = true
    } else if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

const game_start_at = ref<Date>()
const start = () => {
    setTimeout(() => {
        game_start_at.value = new Date()
        if (childRef.value) childRef.value.play()
        focusInput()
    }, 200)
}

const focusInput = () => {
    if (childRef.value) {
        childRef.value.focusInput()
    }
}

const saveSession = () => {
    if (total.value > 0) addSession(correct.value, missed.value, total.value, playType, options, game_start_at, new Date())
    resetScore()
}

const pause = () => {
    router.push(`/${playType}`)
}

const hint = () => {
    return childRef.value ? childRef.value.getRomanizedText(hintType.value) : ""
}

const submit = () => {
    if (childRef.value) childRef.value.submit()
}

const showAnswer = (ans: string, isCorrect: boolean) => {
    answer.value = ans
    answerVal.value = isCorrect ? "correct" : "missed"
    setTimeout(() => {
        answer.value = "?"
        answerVal.value = "answer"
    }, 500)
}

const stopSound = () => {
    childRef.value.stopSequence()
}

/* MOUNT & DEMOUNT */
const playType = (route.path).split("/")[1]
const query = ref(route.query)
const options = ref({})
onBeforeMount(() => {

    if (playType == "integers") {
        options.value = {
            min: ("min" in query.value && !Number.isNaN(Number(query.value.min)) && Number(query.value.min) >= 0 && Number(query.value.min) < 1000000000000) ? Number(query.value.min) : 0,
            max: ("max" in query.value && !Number.isNaN(Number(query.value.max)) && Number(query.value.max) >= 0 && Number(query.value.max) < 1000000000000) ? Number(query.value.max) : 10
        }

        // TODO make sure max >= min

    } else if (playType == "time") {
        options.value = {
            maxHour: ("maxHour" in query.value && Number(query.value.maxHour) && Number(query.value.maxHour) >= 1 && Number(query.value.maxHour) <= 12) ? Number(query.value.maxHour) : 12,
            minHour: ("minHour" in query.value && Number(query.value.minHour) && Number(query.value.minHour) >= 1 && Number(query.value.minHour) <= 12) ? Number(query.value.minHour) : 1,
            maxMinute: ("maxMinute" in query.value && !Number.isNaN(Number(query.value.maxMinute)) && Number(query.value.maxMinute) >= 0 && Number(query.value.maxMinute) <= 59) ? Number(query.value.maxMinute) : 59,
            minMinute: ("minMinute" in query.value && !Number.isNaN(Number(query.value.minMinute)) && Number(query.value.minMinute) >= 0 && Number(query.value.minMinute) <= 59) ? Number(query.value.minMinute) : 0
        }

        // TODO make sure max >= min
        
    } else if (playType == "money") {
        // TODO
    }
})

onMounted(() => {
    window.addEventListener("keypress", handleShortcuts)
    window.addEventListener("keydown", toggleGameRun)
    window.addEventListener("click", focusInput)
    start()
})

onUnmounted(() => {
    saveSession()
    window.removeEventListener("keypress", handleShortcuts)
    window.removeEventListener("keydown", toggleGameRun)
    window.removeEventListener("click", focusInput)
})

onBeforeUnmount(() => {
    stopSound()
})

const childRef = ref(null)
const modalOpen = ref(false)

const closeModal = () => {
    if (modalOpen.value) {
        modalOpen.value = false 
        setTimeout(() => {
            if (childRef.value) childRef.value.play()
        }, 200)
    }
}

const handleResponse = (isCorrect: boolean, value: string) => {
    if (isCorrect) {
        playCorrect()
        addToCorrect(value)
    } else {
        playWrong()
        addToMissed(value)
    }

    showAnswer(value, true)
    if (!forceShowHint.value) showHint.value = false
    if (childRef.value) childRef.value.generateNewValue()
    setTimeout(() => {
        if (childRef.value) childRef.value.play()
    }, 200)
}

</script>

<template>
    <PageHeader />
    <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
        <h1 class="text-5xl md:text-6xl py-4 text-center">Guess the {{ playType.charAt(0).toUpperCase() + playType.slice(1) }}</h1>
        <!-- game -->
        <div class="">
            <div class="text-2xl md:text-3xl font-medium py-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-b-4 mb-8">
                <div class="grid grid-cols-2 gap-3 items-center">
                    <p class="md:text-right">answer: </p>
                    <p class="text-right md:text-left">{{ answer }}</p>
                </div>
                <div class="grid grid-cols-2 gap-3 items-center">
                    <p class="md:text-right">hint:</p>
                    <p class="text-right md:text-left">{{ showHint ? hint() : "" }}<button v-if="!showHint" class="bg-slate-100 hover:bg-slate-200 rounded-md px-2 font-light text-xl md:text-2xl" @click="showHint = true">show <span class="hidden md:inline-block">(h)</span></button></p>
                </div>
            </div>
            <div class="text-center">
                <GuessInput ref="childRef" :input-category="playType" :options="options" @response="handleResponse"/>
            </div>
            <div class="grid grid-cols-3 gap-3 w-full py-4">
                <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">Submit</button>
                <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="repeatAudio">Repeat</button>
                <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="pause">End</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 text-xl md:text-2xl font-light text-center items-center border-t-4 pt-8">
                <p class="py-1 md:py-0"><span class="font-medium">correct:</span> {{ correct.length }}</p>
                <p class="py-1 md:py-0"><span class="font-medium">missed:</span> {{ missed.length }}</p>
                <p class="py-1 md:py-0"><span class="font-medium">total:</span> {{ total }}</p>
            </div>
        </div>
    </div>
    <SettingsModal :is-open="modalOpen" @close="closeModal"/>
    <PageFooter />
</template>
