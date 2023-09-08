<script setup lang="ts">
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()
const num = ref()
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

const submit = () => {
	if (typeof(num.value) === "number") {
		  childRef.value.generateAudioNumbers(num.value)
	}
}

const guessInput = ref(null)
const focusInput = () => {
    if (guessInput.value) {
        guessInput.value.focus()
    }
}

const returnHome = debounce((event) => {
    if (event.code == "Space") {
        home()
    }
}, 100)

const home = () => {
	router.push('/')
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

onMounted(() => {
    updateHint()
    window.addEventListener("keypress", handleShortcuts)
    window.addEventListener("click", focusInput)
	window.addEventListener("keydown", returnHome)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleShortcuts)
    window.removeEventListener("click", focusInput)
	window.removeEventListener("keydown", returnHome)
})

const modalOpen = ref(false)

const closeModal = () => {
    if (modalOpen.value) {
        modalOpen.value = false
    }
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
                <h1 class="text-5xl md:text-6xl py-4">Practice</h1>
				<!-- instructions -->
				<div class="text-xl md:text-2xl font-light">
					<p class="py-2">Type in any number to see what it sounds like.</p>
					<p class="py-2 text-center md:text-left"><span class="font-medium">Min: </span>0 & <span class="font-medium">Max: </span>999999999999</p>
					<div class="text-center">
						<input ref="guessInput" v-model.number="num" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="number" placeholder="input" autofocus min="0" max="999999999999" @keyup.enter="submit"/>
						<GenerateAudioNumbers ref="childRef" class="py-2" :show-jyutping="isJyutping" :show-yale="isYale" :show-traditional="isTraditional"/>
					</div>
				</div>
                <div class="flex flex-col md:flex-row text-center justify-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">submit <span class="hidden md:inline-block">(enter)</span></button>
					<button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="home">home <span class="hidden md:inline-block">(space)</span></button>
                </div>
            </div>
        </div>
        <SettingsModal :is-open="modalOpen" @close="closeModal"/>
        <PageFooter />
    </div>
</template>
