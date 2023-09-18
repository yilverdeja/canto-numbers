<script setup lang="ts">
import categoriesJson from "@/assets/data/categories.json"

/* IMPORTS & CONSTANTS */
import { debounce } from "lodash-es"
const route = useRoute()
const router = useRouter()
const type = route.name?.toString()

const categories = ref(categoriesJson)

const categoryType = ref(categories.value.filter(category => {
        return category.url === route.path
})[0])

const selected = ref("")
const options = ref([{}])

const categorySessions = categoryType.value.sessions
options.value = categorySessions.map((element) => {return {"text": element.name, "value": element.value, "options": element.options}})
selected.value = options.value[0].value

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
const toggleGameRun = debounce((event) => {
    if (event.code == "Space") {
        start()
    }
}, 100)

const getSessionOptions = () => {
    return categorySessions?.filter(session => {
        return session.value === selected.value
    })[0].options
}

const start = () => {
    const sessionQuery = getSessionOptions()

    router.push({path: `/${type}/play`, query: sessionQuery })

}

const handleKeyPresses = debounce((event) => {
    if (event.key == "p") {
        practice()
    } else if (event.key == "s") {
        modalOpen.value = true
    }
}, 100)

const practice = () => {
    router.push(`/${type}/practice`)
}

const learn = () => {
    router.push(`/${type}/learn`)
}

const toStats = () => {
    router.push("/stats")
}

const toCategories = () => {
    router.push("/categories")
}

/* MOUNT & DEMOUNT */
onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
    window.addEventListener("keydown", toggleGameRun)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
    window.removeEventListener("keydown", toggleGameRun)
})

const modalOpen = ref(false)

</script>

<template>
    <PageHeader />
    <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
        <!-- title -->
        <div class="text-left md:text-center py-4 md:py-2 mb-2">
            <h1 class="text-5xl md:text-6xl my-4">{{ categoryType.title }}</h1>
            <h2 class="text-xl md:text-2xl font-light mb-2">{{ categoryType.description }}</h2>
            <div class="font-regular text-xl">
                <a class="hover:text-blue-400 hover:underline cursor-pointer" @click="toStats">See Stats</a>
                <p class="inline-block mx-2 select-none">|</p>
                <a class="hover:text-blue-400 hover:underline cursor-pointer" @click="toCategories">Other Categories</a>
            </div>
        </div>

        <!-- functions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:p-4">

            <!-- play session -->
            <div class="border-2 rounded-md border-gray-500 border-dashed p-4">
                <h3 class="text-xl font-bold mb-2">Play Session</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select v-model="selected" class="text-xl md:text-2xl font-light rounded-md bg-slate-100 hover:bg-slate-200 border-none px-8 py-2 appearance-none max-h-12">
                        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
                    </select>
                <div>
                    <p v-for="(val, key) in getSessionOptions()" :key="key" class="inline-block after:ml-2">{{ key }}: {{ val }}</p>
                </div>
                <button class="text-xl font-light px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="start">Start</button>
                </div>
            </div>

            <!-- practice & learn -->
            <div class="border-2 rounded-md border-gray-500 border-dashed p-4">
                <h3 class="text-xl font-bold mb-2">Practice & Learn</h3>
                <div class="grid grid-cols-2 gap-2">
                    <button class="text-xl font-light my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="practice">Practice</button>
                    <button class="text-xl font-light ml-4 my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md disabled:hover:bg-slate-100 relative" disabled @click="learn">Learn
                        <div class="rounded-md absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 text-white text-sm md:text-xl font-bold opacity-100 transition duration-300 cursor-default select-none">Coming Soon</div>
                    </button>
                </div>
            </div>

        </div>
    </div>
    <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
    <PageFooter />
</template>
