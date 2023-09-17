<script setup lang="ts">
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()
const childRef = ref(null)

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

const focusInput = () => {
    if (childRef.value) {
        childRef.value.focusInput()
    }
}

const returnHome = debounce((event) => {
    if (event.code == "Space") {
        home()
    }
}, 100)

const home = () => {
    router.push(`/${playType}`)
}

// settings store
import { useSettingsStore } from '@/store/settingsStore';
const settingsStore = useSettingsStore()
const { hintType } = storeToRefs(settingsStore)

watch([hintType], () => {
    updateHint()
})

const handleShortcuts = debounce((event) => {
    if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

const updateHint = () => {
    isJyutping.value = hintType.value == "jyutping"
    isYale.value = hintType.value == "yale"
    isTraditional.value = hintType.value == "traditional"
}

const playType = (route.path).split("/")[1]

onMounted(() => {
    updateHint()
    window.addEventListener("keypress", handleShortcuts)
    window.addEventListener("click", focusInput)
	window.addEventListener("keydown", returnHome)
    focusInput()
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleShortcuts)
    window.removeEventListener("click", focusInput)
	window.removeEventListener("keydown", returnHome)
})

onBeforeUnmount(() => {
    stopSound()
})

const modalOpen = ref(false)

const closeModal = () => {
    if (modalOpen.value) {
        modalOpen.value = false
    }
}

const submit = () => {
    if (childRef.value) childRef.value.submit()
}

const stopSound = () => {
    childRef.value.stopSequence()
}

const isJyutping = ref(false)
const isYale = ref(false)
const isTraditional = ref(false)

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
		<div ref="gameArea" class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
            <!-- instructions -->
            <div>
                <h1 class="text-5xl md:text-6xl py-4">Practice {{ playType.charAt(0).toUpperCase() + playType.slice(1) }}</h1>
				<!-- instructions -->
				<div class="text-xl md:text-2xl font-light">
					<p class="py-2">Type in a valid input to see what it sounds like</p>
					<!-- <p class="py-2 text-center md:text-left"><span class="font-medium">Min: </span>0 & <span class="font-medium">Max: </span>999999999999</p> -->
					<div class="text-center">
                        <RequestInput ref="childRef" :input-category="playType" :show-jyutping="isJyutping" :show-traditional="isTraditional" :show-yale="isYale"/>
					</div>
				</div>
                <div class="flex flex-col md:flex-row text-center justify-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">submit</button>
					<button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="home">home</button>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="closeModal"/>
        <PageFooter />
    </div>
</template>
