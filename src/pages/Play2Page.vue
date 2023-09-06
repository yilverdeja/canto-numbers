<script setup lang="ts">
const route = useRoute()
import numbersJson from "@/assets/data/numbers.json"
import { storeToRefs } from 'pinia'
import { useSound } from "@vueuse/sound"
import numbersSfx from "@/assets/data/numbers.mp3"
import correctSfx from "@/assets/audio/correct.mp3"
import wrongSfx from "@/assets/audio/wrong.mp3"
import audiowaveImg from "@/assets/img/audio_wave.png"
import playImg from "@/assets/img/play.png"
const currSprite = ref("")
import { debounce } from "lodash-es"

import { useScoreStore } from "@/store/scoreStore"
const scoreStore = useScoreStore()
const { incrementCorrect, incrementMissed, reset } = scoreStore
const { total, correct, missed } = storeToRefs(scoreStore)

const showHint = ref(false)
const notCompatible = ref(false)

const detectDeviceType = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile': 'Desktop';
}

const spriteMap = numbersJson.reduce((obj, item) => {
    obj[item.number] = item.sprite
    return obj
}, {})

const { play } = useSound(numbersSfx, {
    sprite: spriteMap,
    interrupt: false
})

const { play: playCorrect } = useSound(correctSfx)
const { play: playWrong } = useSound(wrongSfx)

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

const getRandomSprite = () => {
    const spriteKeys = Object.keys(spriteMap)
    return spriteKeys[Math.floor(Math.random() * spriteKeys.length)]
}

const checkGuess = (guessNumber: string) => {
    if (guessNumber == currSprite.value) {
        playCorrect()
        incrementCorrect()
    } else {
        playWrong()
        incrementMissed()
    }
    showAnswer()
}

const makeGuess = (guessNumber: string) => {
    if (gameRunning.value) {
        checkGuess(guessNumber)
        currSprite.value = getRandomSprite()
        setTimeout(() => {
            play({id: currSprite.value})
        }, 200)
        showHint.value = false
    }

}

const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        if (gameRunning.value) {
            // pause
            pause()
        } else {
            // start
            start()
        }
        showHint.value = false
    }
}, 100)

const repeatAudio = () => {
    if (gameRunning.value) {
        play({id: currSprite.value})
    }
}

const handleShortcuts = debounce((event) => {
    if (event.key == "r" && gameRunning.value) {
        repeatAudio()
    } else if (event.key == "h" && gameRunning.value) {
        showHint.value = true
    }
}, 100)

const gameRunning = ref(false)
const start = () => {
    if (gameRunning.value) return
    currSprite.value = getRandomSprite()
    gameRunning.value = true
    setTimeout(() => {
        play({id: currSprite.value})
        focusInput()
    }, 200)
}

const focusInput = () => {
    if (guessInput.value) {
        guessInput.value.focus()
    }
}

const pause = () => {
    if (!gameRunning.value) return
    gameRunning.value = false
}

const hint = () => {
    const result = numbersJson.find(obj => obj.number == currSprite.value)
    if (result) {
        return result.hint
    } else {
        return "no hint"
    }
}

const guessNumber = ref("")
const guessInput = ref(null)

const submit = () => {
    makeGuess(guessNumber.value)
    guessNumber.value = ""
}

const gameArea = ref(null)

const answerVal = ref("answer")
const answer = ref("?")
const showAnswer = () => {
    answer.value = currSprite.value
    answerVal.value = guessNumber.value == currSprite.value ? "correct" : "missed"
    setTimeout(() => {
        answer.value = "?"
        answerVal.value = "answer"
    }, 500)
}

onMounted(() => {
    if (detectDeviceType() == "Mobile") {
        notCompatible.value = true
    }
    window.addEventListener("keypress", handleShortcuts)
    window.addEventListener("keydown", toggleGameRun)
    if (gameArea.value) {
        gameArea.value.addEventListener("click", focusInput)
    }
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleShortcuts)
    window.removeEventListener("keydown", toggleGameRun)
    if (gameArea.value) {
        gameArea.value.removeEventListener("click", focusInput)
    }
})


</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <!-- instructions -->
            <div v-if="!gameRunning">
                <h1 class="text-5xl md:text-6xl py-4">Canto Numbers</h1>
                <div class="grid md:grid-cols-2 gap-6">
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
                    <div class="hidden md:block text-xl md:text-2xl font-light">
                        <p class="py-2"><span class="font-medium">Controls: </span>Use the following keyboard controls for ease of use</p>
                        <ul class="list-disc list-inside">
                            <li>Space: Play / Pause Game</li>
                            <li>Enter: Submit Guess</li>
                            <li>R: Replay Audio</li>
                            <li>H: Hint in Jyutping</li>
                        </ul>
                    </div>
                </div>
                <div class="text-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="start">start <span class="hidden md:inline-block">(space)</span></button>
                </div>
            </div>

            <!-- game -->
            <div v-else ref="gameArea" class="">
                <div class="text-3xl font-medium py-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-b-4 mb-8">
                    <div class="grid grid-cols-2 gap-3 items-center">
                        <p class="md:text-right">answer: </p>
                        <p class="text-right md:text-left">{{ answer }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3 items-center">
                        <p class="md:text-right">hint:</p>
                        <p class="text-right md:text-left">{{ showHint ? hint() : "" }}<button v-if="!showHint" class="bg-slate-100 hover:bg-slate-200 rounded-md px-2 font-light text-2xl" @click="showHint = true">show <span class="hidden md:inline-block">(h)</span></button></p>
                    </div>
                </div>
                <div class="text-center">
                    <input ref="guessInput" v-model.number="guessNumber" class="text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="number" placeholder="guess" autofocus @keyup.enter="submit"/>
                </div>
                <div class="grid grid-cols-3 gap-3 w-full py-4">
                    <button class="text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">submit <span class="hidden md:inline-block">(enter)</span></button>
                    <button class="text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="repeatAudio">repeat <span class="hidden md:inline-block">(r)</span></button>
                    <button class="text-2xl font-light text-center py-4 bg-slate-100 hover:bg-slate-200 rounded-md" @click="pause">pause <span class="hidden md:inline-block">(space)</span></button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 text-2xl font-light text-center items-center border-t-4 pt-8">
                    <p class="py-1 md:py-0"><span class="font-medium">correct:</span> {{ correct }} / {{ total }}</p>
                    <p class="py-1 md:py-0"><span class="font-medium">missed:</span> {{ missed }} / {{ total }}</p>
                    <button class="bg-slate-100 hover:bg-slate-200 rounded-md py-4 mt-1 md:mt-0" @click="reset">reset stats</button>
                </div>
            </div>
        </div>
        <PageFooter />
    </div>
</template>
