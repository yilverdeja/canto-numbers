<script setup lang="ts">
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es"
const route = useRoute()

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

// TODO not recommended to create a new date in the sorting function
const sortSessions = (a, b) => {
    return (new Date(b.start_at) - new Date(a.start_at))
}

</script>

<template>
    <PageHeader />
    <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
        <div class="flex flex-row justify-between">
            <h1 class="text-5xl md:text-6xl py-4">Stats</h1>
            <div>
                <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="reset">reset</button>
            </div>
        </div>
        <p class="py-2 text-xl md:text-2xl font-light">View all sessions below</p>
        <div v-if="sessions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatsCard v-for="session of sessions.sort(sortSessions)" :key="session" :session="session"/>
        </div>
        <p v-else class="py-2 text-lg md:text-xl font-light">No session data available</p>
    </div>
    <SettingsModal :is-open="modalOpen" @close="closeModal"/>
    <PageFooter />
</template>
