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

/* FUNCTIONS */
const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        start()
    }
}, 100)

const start = () => {
    router.push("/play")
}

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keydown", toggleGameRun)
})

onUnmounted(() => {
    window.removeEventListener("keydown", toggleGameRun)
})

// const detectDeviceType = () => {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile': 'Desktop';
// }

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <!-- instructions -->
            <div>
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
        </div>
        <PageFooter />
    </div>
</template>
