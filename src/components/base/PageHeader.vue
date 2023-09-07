<script setup lang="ts">
</script>

<template>
    <header class="sticky top-0 inset-x-0 flex justify-start flex-nowrap z-50 w-full text-md py-4 sm:py-0 bg-slate-100">
        <nav class="relative max-w-[85rem] w-full mx-auto px-8 flex items-center justify-between">
            <!-- brand + collapsed nav -->
            <div class="flex items-center justify-between">
                <div class="font-medium text-2xl">sik1teng1</div>
            </div>

            <!-- nav -->
            <div class="basis-full grow">
                <div class="flex flex-row pb-0 items-center justify-end gap-y-0 gap-x-7 my-0 pl-7 static w-auto top-6 duration-500 ease-in">
                    <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/play')">play</a>
                    <!-- <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="$router.push('/play2')">play v2</a> -->
                    <!-- <a class="font-medium sm:py-6 hover:underline decoration-2 cursor-pointer" @click="openModal">more+</a> -->
                </div>
            </div>
        </nav>
    </header>
</template>
