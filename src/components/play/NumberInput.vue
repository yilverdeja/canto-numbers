<script setup lang="ts">
    const guessNumber = ref("")
    import { debounce } from "lodash-es"

    const isEnter = (event) => {
        return event.keyCode == 13
    }
    const isNumber = (event) => {
        if (event.keyCode == 46) {
            if (guessNumber.value.indexOf(".") === -1) {
                return true
            } else {
                return false
            }
        } else {
            if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
                return false
            }
        }
        return true
    }

    const isBackspace = (event) => {
        return event.code === "Backspace"
    }

    const emit = defineEmits(["submit"])

    const submit = () => {
        console.log("Submit: ", guessNumber.value)
        emit("submit", guessNumber.value)
        guessNumber.value = ""
    }

    const write = debounce((event) => {
        if (isEnter(event)) {
            submit()
        } else if (isNumber(event)) {
            guessNumber.value += event.key
        }
    }, 10)

    const backspace = debounce((event) => {
        if (isBackspace(event) && guessNumber.value.length > 0) {
            guessNumber.value = guessNumber.value.slice(0, -1)
        }
    }, 10)

    onMounted(() => {
        console.log("mount num input")
        window.addEventListener("keypress", write)
        window.addEventListener("keydown", backspace)
    })

    onUnmounted(() => {
        console.log("unmount num input")
        window.removeEventListener("keypress", write)
        window.removeEventListener("keydown", backspace)
    })

    
</script>

<template>
    <div class="text-center">
        <h1 class="text-8xl font-medium">{{ guessNumber }}</h1>
        <button class="w-5/6 py-2 border-t-4" @click="submit">submit</button>
    </div>
</template>