<script setup lang="ts">
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()
const num = ref()
const childRef = ref(null)

// stats store
import { useStatsStore } from "@/store/statsStore"
const statsStore = useStatsStore()
const { sessions } = storeToRefs(statsStore)
const { reset } = statsStore

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

const handleShortcuts = debounce((event) => {
    if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

onMounted(() => {
    window.addEventListener("keypress", handleShortcuts)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleShortcuts)
})

const modalOpen = ref(false)

const closeModal = () => {
    if (modalOpen.value) {
        modalOpen.value = false
    }
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
		<div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <div class="flex flex-row justify-between">
                <h1 class="text-5xl md:text-6xl py-4">Stats</h1>
                <div>
                    <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="reset">reset</button>
                </div>
            </div>
            <p class="py-2 text-xl md:text-2xl font-light">See all sessions below</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="session of sessions" :key="session" class="font-light rounded-md shadow-xl bg-white p-2">
                    <p><span class="font-medium">type: </span>{{ session.type }}</p>
                    <div class="flex flex-row">
                        <div v-for="option in Object.keys(session.options)" :key="option" class="pr-1">
                            <p><span class="font-medium">{{ option }}: </span>{{ session.options[option] }}</p>
                        </div>
                    </div>
                    <div class="flex flex-row">
                        <p class="pr-1"><span class="font-medium">correct: </span>{{ session.correct.length }}</p>
                        <p class="pr-1"><span class="font-medium">missed: </span>{{ session.missed.length }}</p>
                        <p class="pr-1"><span class="font-medium">total: </span>{{ session.total }}</p>
                    </div>
                    <p><span class="font-medium">date: </span>{{ new Date(session.start_at).toLocaleString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric" }) }}</p>
                    <p class="pr-1"><span class="font-medium">duration: </span>{{ ((new Date(session.end_at).getTime() - new Date(session.start_at).getTime())/1000).toFixed(2)}}s</p>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="closeModal"/>
        <PageFooter />
    </div>
</template>
