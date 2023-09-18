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

const categories = () => {
    router.push("/categories")
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
    <PageHeader />
    <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">

        <!-- title -->
        <div class="text-left md:text-center py-4 md:py-2">
            <h1 class="text-5xl md:text-6xl my-4">Canto Numbers</h1>
            <h2 class="text-2xl md:text-3xl font-light">Your gateway to mastering Cantonese numeral concepts!</h2>
        </div>

        <!-- information -->
        <div class="grid md:grid-cols-3 gap-3 md:gap-6 p-2 md:p-4">

            <!-- about -->
            <div class="text-xl hidden md:block">
                <h3 class="font-bold">About</h3>
                <p class="font-light">Canto Numbers is your ultimate resource for learning how to pronounce and understand numbers in Cantonese. Whether you're a beginner or looking to brush up on your skills, our interactive platform is designed to make learning fun and engaging.</p>
            </div>

            <!-- features -->
            <div class="text-xl">
                <h3 class="font-bold">Features</h3>
                <ul class="font-light list-disc list-inside hidden md:block">
                    <li><span class="font-medium">Play: </span>Test your knowledge and improve your listening skills with our exciting guessing games</li>
                    <li><span class="font-medium">Practice: </span>Perfect your pronunciation by requesting for specific items</li>
                    <li><span class="font-medium">Learn: </span>Understand the patterns and rules behind each Cantonese numeral concept</li>
                </ul>
                <ul class="font-light list-disc list-inside block md:hidden">
                    <li><span class="font-medium">Play: </span>Test your knowledge with exciting guessing games</li>
                    <li><span class="font-medium">Practice: </span>Improve pronunciation with specific requests</li>
                    <li><span class="font-medium">Learn: </span>Discover Cantonese numeral patterns and rules</li>
                </ul>
            </div>

            <!-- categories -->
            <div class="text-xl">
                <h3 class="font-bold">Categories</h3>
                <p class="font-light hidden md:block">Ready to get started? Explore our categories and dive into the world of Cantonese numbers!</p>
                <p class="font-light block md:hidden">Ready to start learning? Explore our categories!</p>
                <button class="font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="categories">Categories</button>
            </div>
            
        </div>

    </div>
    <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
    <PageFooter />
</template>
