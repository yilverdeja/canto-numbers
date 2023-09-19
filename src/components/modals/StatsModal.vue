<script setup lang="ts">
import { debounce } from "lodash-es"
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle
} from '@headlessui/vue'

const props = defineProps({
    session: {
        type: Object,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["close"])

const closeModal = () => {
    emit("close")
}

const backButtonRef = ref(null)

const handleKeyPresses = debounce((event) => {
     if (event.key == "b") {
        closeModal()
    }
}, 100)

/* MOUNT & DEMOUNT */
const performancePercentage = ref()
onBeforeMount(() => {
	performancePercentage.value = Math.floor((props.session.correct.length / props.session.total) * 100)
	// missedCount.value = flow(countBy, entries, partialRight(maxBy, last))(props.session.missed)
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

onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
})

const sessionDate = computed(() => {
	return new Date(props.session.start_at).toLocaleString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric" })
})

const sessionDuration = computed(() => {
	return ((new Date(props.session.end_at).getTime() - new Date(props.session.start_at).getTime())/1000).toFixed(2)
})

</script>

<template>
    <!-- Wrap your dialog in a `TransitionRoot`. -->
    <TransitionRoot :show="isOpen" as="template">
        <Dialog :initial-focus="backButtonRef" class="relative z-50" @close="closeModal">
            <!-- Wrap your backdrop in a `TransitionChild`. -->
            <TransitionChild
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <!-- The backdrop, rendered as a fixed sibling to the panel container -->
                <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
            </TransitionChild>

            <!-- Full-screen container to center the panel -->
            <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
                <!-- Wrap your panel in a `TransitionChild`. -->
                <TransitionChild
                    enter="duration-300 ease-out"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <!-- The actual dialog panel -->
                    <DialogPanel class="w-full rounded bg-white p-4 font-light shadow-xl">
                        <div class="flex flex-row justify-between py-2 items-center">
                            <DialogTitle class="text-2xl font-medium">{{ session.type.charAt(0).toUpperCase() + session.type.slice(1) }}</DialogTitle>
                            <div class="text-right">
                                <span :class="`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${performanceClass} text-white`">{{ performancePercentage }}%</span>
                            </div>
                        </div>
                        
                        <!-- Session Date & Duration -->
                        <div class="py-2 text-md font-regular text-gray-400">
                            <p>On <span>{{ sessionDate }}</span> for <span>{{ sessionDuration }}s</span></p>
                        </div>

                        <!-- Play Settings -->
                        <div v-for="option in Object.keys(session.options)" :key="option" class="inline-flex items-center">
                            <div class="m-1 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-400 text-white">
                                <span class="font-medium">{{ option }}: {{ session.options[option] }}</span>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="p-2">
                            <!-- Total -->
                            <div class="text-xl py-2">
                                <h2 class="font-medium">Total ({{ session.total }})</h2>
                            </div>

                            <!-- Specific Score -->
                            <div v-if="session.correct.length > 0" class="text-xl py-2">
                                <h2 class="font-medium">Correct ({{ session.correct.length }})</h2>
                                <p class="">{{ session.correct.join(', ') }}</p>
                            </div>

                            <div v-if="session.missed.length > 0" class="text-xl py-2">
                                <h2 class="font-medium">Missed ({{ session.missed.length }})</h2>
                                <p class="">{{ session.missed.join(', ') }}</p>
                            </div>

                        </div>

                        <!-- Specific Values -->

                        <div class="text-center">
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="closeModal()">back</button>
                        </div>

                    </DialogPanel>
                
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>