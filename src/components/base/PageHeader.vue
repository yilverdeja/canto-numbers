<script setup lang="ts">
const modalOpen = ref(false)
const open = ref(false)
const toggleNav = () => { open.value = !open.value}

// theme store
import { useThemeStore } from "@/store/themeStore"
const themeStore = useThemeStore()
const { toggleTheme } = themeStore
const { theme } = storeToRefs(themeStore)

</script>

<template>
    <header class="sticky top-0 inset-x-0 flex justify-start flex-nowrap z-50 w-full text-md py-4 bg-slate-100">
        <nav class="relative max-w-[85rem] w-full mx-auto px-8 flex items-center justify-between">
            <!-- brand + collapsed nav -->
            <div class="flex items-center justify-between w-full">
                <div class="flex flex-row">
                    <img src="@/assets/canto-numbers.svg" width="25" class="mr-1"/>
                    <h1 class="font-medium text-2xl cursor-pointer" @click="$router.push('/')">CantoNumbers</h1>
                </div>
                <div className="absolute sm:hidden right-6 p-2 inline-flex justify-center items-center gap-2 text-white align-middle cursor-pointer text-black" @click="toggleNav()">
                    <span :className="`${open ? 'i-mdi-close' : 'i-mdi-menu'} `" :style="{ fontSize: '24px' }"></span>
                </div>
            </div>

            <div class="basis-full grow">
                <div :class="`${open ? 'left-0' : 'left-[-100%]'} bg-slate-100 flex flex-col gap-y-4 gap-x-0 my-5 pb-5 sm:pb-0 pl-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:my-0 sm:pl-7 sm:static absolute w-full sm:w-auto top-6 duration-500 ease-in`">
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/')">Home</a>
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/categories')">Categories</a>
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/stats')">Stats</a>
                    <a class="flex cursor-pointer" @click="modalOpen = true">
                        <p class="flex font-medium justify-center items-center"><span class="sm:hidden inline-block">Settings </span><i class="text-2xl i-mdi-gear justify-center items-center md:ml-2 sm:inline-block hidden"></i></p>
                    </a>
                    <!-- <a class="flex cursor-pointer" @click="toggleTheme">
                        <p class="flex font-medium justify-center items-center"><span class="sm:hidden inline-block">Toggle Theme </span>
                            <i v-if="theme === 'light'" class="text-2xl i-mdi-moon-and-stars justify-center items-center md:ml-2 sm:inline-block hidden"></i>
                            <i v-else class="text-2xl i-mdi-white-balance-sunny justify-center items-center md:ml-2 sm:inline-block hidden"></i>
                        </p>
                    </a> -->
                </div>
            </div>
        </nav>
    </header>
    <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
</template>
