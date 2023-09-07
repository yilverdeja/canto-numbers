<script setup lang="ts">
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
	console.log("submit")
	if (typeof(num.value) === "number") {
		childRef.value.generateAudioNumbers(num.value)
	}
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <PageHeader />
        <div class="max-w-[85rem]">
            <input v-model.number="num" type="number" placeholder="any number" @keyup.enter="submit"/>
            <button @click="submit">Listen</button>
			<GenerateAudioNumbers ref="childRef" :show="true"/>
        </div>
		
        <PageFooter />
    </div>
</template>
