<script setup lang="ts">
const modalOpen = ref(false)


</script>

<template>
    <header class="sticky top-0 inset-x-0 flex justify-start flex-nowrap z-50 w-full text-md py-4 bg-slate-100">
        <nav class="relative max-w-[85rem] w-full mx-auto px-8 flex items-center justify-between">
            <!-- brand + collapsed nav -->
            <div class="flex items-center md:justify-between w-full justify-center">
                <div class="flex flex-row">
                    <img src="@/assets/canto-numbers.svg" width="25" class="mr-1"/>
                    <h1 class="font-medium text-2xl cursor-pointer" @click="$router.push('/')">CantoNumbers</h1>
                </div>
            </div>

            <!-- nav -->
            <a class="flex cursor-pointer" @click="modalOpen = true">
                <p class="flex text-xl justify-center items-center"><span class="hidden md:inline-block">settings </span><i class="text-2xl i-mdi-gear justify-center items-center md:ml-2"></i></p>
            </a>
            <!-- <div class="basis-full grow">
                <div class="flex flex-row pb-0 items-center justify-end gap-y-0 gap-x-7 my-0 pl-7 static w-auto top-6 duration-500 ease-in">
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/')">home</a>
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/play')">play</a>
                </div>
            </div> -->
        </nav>
    </header>
    <SettingsModal :is-open="modalOpen" @close="modalOpen = false"/>
</template>
