<script setup lang="ts">
const route = useRoute()
import numbersJson from "@/assets/data/numbers.json"
import { storeToRefs } from 'pinia'
import { useSound } from "@vueuse/sound"
import numbersSfx from "@/assets/data/numbers.mp3"
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
    console.log(item)
    obj[item.number] = item.sprite
    return obj
}, {})

const { play } = useSound(numbersSfx, {
    sprite: spriteMap,
    interrupt: false
})

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
        console.log("yay")
        incrementCorrect()
    } else {
        console.log("nay")
        incrementMissed()
    }
}

const makeGuess = (guessNumber: string) => {
    if (gameRunning.value) {
        checkGuess(guessNumber)
        currSprite.value = getRandomSprite()
        play({id: currSprite.value})
        showHint.value = false
    }

}

// const toggleGameRun = debounce((event) => {
//     if (event.code == "Space") {
//         if (gameRunning.value) {
//             // pause
//             pause()
//         } else {
//             // start
//             start()
//         }
//         showHint.value = false
//     }
// }, 100)

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

onMounted(() => {
    console.log("mount play")
    if (detectDeviceType() == "Mobile") {
        notCompatible.value = true
    }
    window.addEventListener("keypress", handleShortcuts)
    // window.addEventListener("keydown", toggleGameRun)
    setTimeout(() => {
        currSprite.value = getRandomSprite()
        play({id: currSprite.value})
    }, 1000)
})

onUnmounted(() => {
    console.log("unmount play")
    window.removeEventListener("keypress", handleShortcuts)
    // window.removeEventListener("keydown", toggleGameRun)
})

const gameRunning = ref(true)
// const start = () => {
//     if (gameRunning.value) return
//     console.log("start game")
//     currSprite.value = getRandomSprite()
    
// }

// const pause = () => {
//     if (!gameRunning.value) return
//     console.log("pause game")
//     gameRunning.value = false
// }

const hint = () => {
    const result = numbersJson.find(obj => obj.number == currSprite.value)
    if (result) {
        return result.hint
    } else {
        return "no hint"
    }
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div v-if="notCompatible" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <p class="text-xl text-center px-4 sm:px-2">Unfortunately, this web app cannot be used on a mobile browser. Please switch to a desktop browser to play.</p>
        </div>
        <div v-else class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <div class="p-2 sm:px-4">
                <p class="font-light text-2xl text-center">do you really know numbers in cantonese?</p>
                <p class="font-light text-xl text-center">type in what you hear</p>
                <!-- <p class="text-center font-light">tap {{ gameRunning ? "pause" : "play" }} or press 'space' to {{ gameRunning ? "pause" : "start" }}</p> -->
            </div>
            <div v-if="gameRunning" class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col">
                    <div class="flex-grow">
                        <img class="w-2/3" :src="audiowaveImg" @click="repeatAudio"/>
                    </div>
                    <p v-if="showHint" class="text-center text-xl font-medium py-2">{{ hint() }}</p>
                    <p class="text-center font-light">tap wavelength or press 'r' to repeat</p>
                </div>
                <div class="flex flex-col">
                    <div class="flex-grow">
                        <NumberInput @submit="makeGuess"/>
                    </div>
                    <p class="text-center font-light">tap submit or press 'enter' to submit</p>
                </div>
            </div>
            <div v-else class="flex-grow mx-auto text-center">
                <p class="">Paused</p>
                <!-- <img :src="playImg" @click="start"/> -->
            </div>
            <div class="sm:pt-4">
                <p class="text-center text-2xl font-medium my-4">Stats</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 text-center">
                    <p><span class="font-medium">correct:</span> {{ correct }} / {{ total }}</p>
                    <p><span class="font-medium">missed:</span> {{ missed }} / {{ total }}</p>
                    <button @click="reset">reset</button>
                </div>
            </div>
        </div>
        <PageFooter />
    </div>
</template>
