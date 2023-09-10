<script setup lang="ts">
/* IMPORTS & CONSTANTS */
import { storeToRefs } from 'pinia'
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()

const minVal = ref(0)
const maxVal = ref(10)

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

// data & sprits
const currSprite = ref("")

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
const guessNumber = ref("")
const guessInput = ref(null)
const answerVal = ref("answer")
const answer = ref("?")

/* GAME FUNCTIONS */

const getRandomNumber = () => {
    return Math.floor(Math.random() * (maxVal.value - minVal.value + 1)) + minVal.value
}

const checkGuess = (guessNumber: string) => {
    if (guessNumber == currSprite.value) {
        playCorrect()
        addToCorrect(currSprite.value)
    } else {
        playWrong()
        addToMissed(currSprite.value)
    }
    showAnswer()
}

const playNumber = (num: Number) => {
    if (typeof(num) === "number") {
        childRef.value.generateAudioNumbers(num)
	}
}

const makeGuess = (guessNumber: string) => {
    checkGuess(guessNumber)
    currSprite.value = getRandomNumber()
    setTimeout(() => {
        playNumber(currSprite.value)
    }, 200)

    if (!forceShowHint.value) showHint.value = false

}

const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        pause()
        if (!forceShowHint.value) showHint.value = false
    }
}, 100)

const repeatAudio = () => {
    playNumber(currSprite.value)
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
    currSprite.value = getRandomNumber()
    setTimeout(() => {
        game_start_at.value = new Date()
        playNumber(currSprite.value)
        focusInput()
    }, 200)
}

const focusInput = () => {
    if (guessInput.value) {
        guessInput.value.focus()
    }
}

const pause = () => {
    addSession(correct.value, missed.value, total.value, "integer", {"min": minVal.value, "max": maxVal.value}, game_start_at, new Date())
    resetScore()
    router.push("/")
}

const hint = () => {
    return childRef.value ? childRef.value.getRomanization(hintType.value) : ""
}

const submit = () => {
    makeGuess(guessNumber.value)
    guessNumber.value = ""
}

const showAnswer = () => {
    answer.value = currSprite.value
    answerVal.value = guessNumber.value == currSprite.value ? "correct" : "missed"
    setTimeout(() => {
        answer.value = "?"
        answerVal.value = "answer"
    }, 500)
}

/* MOUNT & DEMOUNT */
const query = ref(route.query)
onBeforeMount(() => {
    if ("min" in query.value && Number(query.value.min)) {
        minVal.value = Number(query.value.min)
    }
    if ("max" in query.value && Number(query.value.max)) {
        maxVal.value = Number(query.value.max)
    }
})

onMounted(() => {
    window.addEventListener("keypress", handleShortcuts)
    window.addEventListener("keydown", toggleGameRun)
    window.addEventListener("click", focusInput)
    start()
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleShortcuts)
    window.removeEventListener("keydown", toggleGameRun)
    window.removeEventListener("click", focusInput)
})

const childRef = ref(null)
const modalOpen = ref(false)

const closeModal = () => {
    if (modalOpen.value) {
        modalOpen.value = false 
        setTimeout(() => {
            playNumber(currSprite.value)
        }, 200)
    }
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
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
                    <input ref="guessInput" v-model.number="guessNumber" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="number" placeholder="guess" autofocus @keyup.enter="submit"/>
                    <GenerateAudioNumbers ref="childRef"/>
                </div>
                <div class="grid grid-cols-3 gap-3 w-full py-4">
                    <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">submit <span class="hidden md:inline-block">(enter)</span></button>
                    <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="repeatAudio">repeat <span class="hidden md:inline-block">(r)</span></button>
                    <button class="text-xl md:text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="pause">pause <span class="hidden md:inline-block">(space)</span></button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 text-xl md:text-2xl font-light text-center items-center border-t-4 pt-8">
                    <p class="py-1 md:py-0"><span class="font-medium">correct:</span> {{ correct }}</p>
                    <p class="py-1 md:py-0"><span class="font-medium">missed:</span> {{ missed }}</p>
                    <p class="py-1 md:py-0"><span class="font-medium">total:</span> {{ total }}</p>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="closeModal"/>
        <PageFooter />
    </div>
</template>
