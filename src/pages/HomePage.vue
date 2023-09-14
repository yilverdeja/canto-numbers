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
const handleKeyPresses = debounce((event) => {
    if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

const stats = () => {
    router.push("/stats")
}

const integers = () => {
    router.push("/integers")
}

const time = () => {
    router.push("/time")
}

const money = () => {
    router.push("/money")
}

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
})

const modalOpen = ref(false)

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
                        <p class="py-2"><span class="font-medium">About: </span>Learn to distinguish different types of numbers in Cantonese like integers, time, and money</p>
                        <p class="py-2"><span class="font-medium">How to play: </span>Select the category, choose the game settings, and click play</p>
                        <p class="py-2"><span class="font-medium">Sounds: </span>Get aquainted to the correct and wrong sound effects</p>
                        <div class="grid grid-cols-2 gap-6">
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="playCorrect">correct</button>
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="playWrong">wrong</button>
                        </div>
                    </div>

                    <!-- controls -->
                    <div class="text-xl md:text-2xl font-light">
                        <div>
                            <p class="py-2"><span class="font-medium"><i class="text-lg i-mdi-gear justify-center items-center md:ml-2"></i> Settings: </span>Update global site settings</p>
                        </div>
                        <div class="hidden md:block ">
                            <p class="py-2"><span class="font-medium">Controls: </span>Use the following keyboard controls for ease of use</p>
                            <ul class="list-disc list-inside">
                                <li>Space: Play / Pause Game</li>
                                <li>Enter: Submit Guess</li>
                                <li>R: Replay Audio</li>
                                <li>H: Show Hint</li>
                                <li>S: Open Settings</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row text-center justify-center md:justify-around">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="integers">integers</button>
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="time">time</button>
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md disabled:bg-slate-300" disabled @click="money">money</button>
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="stats">stats</button>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
        <PageFooter />
    </div>
</template>
