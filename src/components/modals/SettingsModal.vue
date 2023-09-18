<script setup lang="ts">
import { debounce } from "lodash-es"
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
} from '@headlessui/vue'

// settings store
import { useSettingsStore } from '@/store/settingsStore';
const settingsStore = useSettingsStore()
const { updateHintType, toggleShowHint } = settingsStore
const { hintType, showHint } = storeToRefs(settingsStore)

// https://www.tutorialspoint.com/how-to-fix-property-not-existing-on-eventtarget-in-typescript
const changeHintType = (event: Event) => {
    if (event.target) {
        const eventValue = (event.target as HTMLInputElement).value
        updateHintType(eventValue)
    }
}

const changeHintShow = (event: Event) => {
    if (event.target) {
        toggleShowHint()
    }
}

defineProps({
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
onMounted(() => {
    window.addEventListener("keypress", handleKeyPresses)
})

onUnmounted(() => {
    window.removeEventListener("keypress", handleKeyPresses)
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
                    <DialogPanel class="w-full max-w-sm rounded bg-white p-4 text-xl md:text-2xl font-light border-8">
                        <DialogTitle class="font-medium">Setting</DialogTitle>
                        <DialogDescription>Edit site & play settings</DialogDescription>

                        <div>
                            <label class="font-medium">Hint:</label>
                            <select :value="hintType" class="text-xl md:text-2xl font-light rounded-md bg-slate-100 hover:bg-slate-200 border-none px-8 py-2 my-4 mx-4 appearance-none" @change="changeHintType">
                                <option value="jyutping">Jyutping</option>
                                <option value="yale">Yale</option>
                                <option value="traditional">Chinese</option>
                            </select>
                        </div>

                        <div>
                            <label class="text-xl md:text-2xl font-medium">Show Hint: </label>
                            <input class="p-2 rounded-md" type="checkbox" :checked="showHint" @change="changeHintShow" />
                        </div>

                        <div class="text-center">
                            <button class="my-4 px-8 py-2 bg-slate-100 hover:bg-slate-200 rounded-md" @click="closeModal()">back</button>
                        </div>
                    </DialogPanel>
                
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>