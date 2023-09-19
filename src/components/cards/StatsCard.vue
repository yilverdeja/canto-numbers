<script setup lang="ts">
import { countBy, entries, flow, last, maxBy, partialRight } from "lodash-es"

const modalOpen = ref(false)
const performancePercentage = ref()
const missedCount = ref({})
const props = defineProps({
	session: {
		type: Object,
		required: true
	}
});

onBeforeMount(() => {
	performancePercentage.value = Math.floor((props.session.correct.length / props.session.total) * 100)
	missedCount.value = flow(countBy, entries, partialRight(maxBy, last))(props.session.missed)
})

const performanceClass = computed(() => {
	if (performancePercentage.value < 60) {
		return 'bg-red-500 text-white';
	} else if (performancePercentage.value < 80) {
		return 'bg-yellow-500 text-black';
	} else {
		return 'bg-green-500 text-white';
	}
})

const performanceSummary = computed(() => {
	if (performancePercentage.value > 95) {
		return ["Great!", "Amazing!", "Keep it up!"][Math.floor(Math.random()*3)]
	} else {
		const missedVal = missedCount.value[0]
		const missedIter = missedCount.value[1]
		return `You missed '${missedVal}' ${missedIter} time${missedIter > 1 ? 's' : ''}`
	}
})

const sessionDate = computed(() => {
	return new Date(props.session.start_at).toLocaleString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric" })
})

</script>

<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4">
		<!-- Card Header -->
		<div class="flex flex-row justify-between">
			<!-- Category -->
			<div class="">
				<h1 class="text-xl font-medium">{{ session.type.charAt(0).toUpperCase() + session.type.slice(1) }}</h1>
			</div>

			<!-- Performance Indicator -->
			<div class="text-right">
				<span :class="`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${performanceClass} text-white`">{{ performancePercentage }}%</span>
			</div>
		</div>

		<!-- Summary of Performance -->
		<div class="py-2">{{ performanceSummary }}</div>

		<!-- Card Footer -->
		<div class="flex flex-row justify-between">
			<!-- Date -->
			<div class="py-2">
				<span class="text-xs font-regular text-gray-400">{{ sessionDate }}</span>
			</div>

			<!-- Details Button -->
			<div class="p-2 text-right text-blue-500 flex flex-row items-center">
				<button class="" @click="modalOpen = true">Details</button>
				<i class="items-center i-mdi-arrow-right-thin ml-1"></i>
			</div>
		</div>
  	</div>
	<StatsModal :session="session" :is-open="modalOpen" @close="modalOpen = false"/>
</template>