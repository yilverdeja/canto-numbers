<script setup lang="ts">
import { debounce } from "lodash-es"
const route = useRoute()
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
        start()
    }
}, 100)

onMounted(() => {
    window.addEventListener("click", focusInput)
	window.addEventListener("keydown", returnHome)
})

onUnmounted(() => {
    window.removeEventListener("click", focusInput)
	window.removeEventListener("keydown", returnHome)
})

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
						<input ref="guessInput" v-model.number="num" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="number" placeholder="guess" autofocus min="0" max="999999999999" @keyup.enter="submit"/>
						<GenerateAudioNumbers ref="childRef" class="py-2" :show="true"/>
					</div>
				</div>
                <div class="flex flex-col md:flex-row text-center justify-center">
                    <button class="text-xl md:text-2xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="submit">submit <span class="hidden md:inline-block">(enter)</span></button>
					<button class="text-xl md:text-2xl font-light md:ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="$router.push('/')">home <span class="hidden md:inline-block">(space)</span></button>
                </div>
            </div>
        </div>
        <PageFooter />
    </div>
</template>
