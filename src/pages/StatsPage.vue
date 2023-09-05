<script setup lang="ts">
const route = useRoute()

import { useScoreStore } from "@/store/scoreStore"
const scoreStore = useScoreStore()
const { reset } = scoreStore
const { total, correct, missed } = storeToRefs(scoreStore)

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
</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div class="max-w-[85rem]">
            <p>correct: {{ correct }} / {{ total }}</p>
            <p>missed: {{ missed }} / {{ total }}</p>
            <button @click="reset">Reset</button>
        </div>
        <PageFooter />
    </div>
</template>
