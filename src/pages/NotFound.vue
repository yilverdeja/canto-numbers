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

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
          <h1 class="text-5xl md:text-6xl py-4">Sorry, this page is not available.</h1>
          <button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="home">Return Home</button>
        </div>
        <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
        <PageFooter />
    </div>
</template>
