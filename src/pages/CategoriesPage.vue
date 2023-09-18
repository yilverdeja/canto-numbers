<script setup lang="ts">
import categoriesJson from "@/assets/data/categories.json"

const router = useRouter()

const categories = ref(categoriesJson)

// sort published first
categories.value.sort((a, b) => {
    if (a.published && b.published) return 0
    if (a.published) return -1
    if (b.published) return 1
})

const toCategory = (url, isPublished) => {
    if (isPublished) router.push(url)
}

</script>

<template>
    <PageHeader />
    <div class="max-w-[85rem] w-full mx-auto px-4 h-full flex flex-col py-4 sm:py-10">
        <!-- title -->
        <div class="text-left md:text-center py-4 md:py-2 mb-2">
            <h1 class="text-5xl md:text-6xl my-4">Categories</h1>
            <h2 class="text-xl md:text-2xl font-light">Explore various numeral concept categories</h2>
        </div>

        <!-- categories -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="category in categories" :key="category.title" class="relative shadow-md bg-white rounded-md overflow-hidden cursor-pointer" @click="toCategory(category.url, category.published)">
                <!-- Image -->
                <img :src="category.image" alt="Category Image" class="w-full sm:h-32 object-cover">

                <!-- Coming Soon Overlay -->
                <div v-if="!category.published" class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white text-xl font-bold opacity-100 transition duration-300 cursor-default select-none"
                >Coming Soon</div>

                <!-- Card Content -->
                <div class="px-6 py-4">
                    <!-- Category Name -->
                    <div class="font-bold text-xl mb-2">{{ category.title }}</div>

                    <!-- Description -->
                    <p class="text-gray-700 text-base">{{ category.description }}</p>
                </div>
            </div>
        </div>
    </div>
    <PageFooter />
</template>