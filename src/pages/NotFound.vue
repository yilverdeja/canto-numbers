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
/* FUNCTIONS */
const handleKeyPresses = debounce((event) => {
    if (event.key == "s") {
        modalOpen.value = true
    }
})

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
})

const modalOpen = ref(false)

const home = () => {
    router.push("/")
}

const goBack = () => {
    router.back()
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
          <h1 class="text-5xl md:text-6xl my-4">Page Not Found</h1>
          <h2 class="text-xl md:text-2xl font-light mb-2">Sorry, but this page is not available</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-3">
            <button class="text-xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="home">Return Home</button>
            <button class="text-xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="goBack">Go Back</button>
          </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
        <PageFooter />
    </div>
</template>
