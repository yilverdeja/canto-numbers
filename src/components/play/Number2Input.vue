<script setup lang="ts">
    const guessNumber = ref("")

    const emit = defineEmits(["submit"])

    const submit = () => {
        console.log("Submit: ", guessNumber.value)
        emit("submit", guessNumber.value)
        guessNumber.value = ""
    }
    
</script>

<template>
    <div class="text-center">
        <input v-model.number="guessNumber" class="text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="number" placeholder="guess" autofocus @keyup.enter="submit" @keydown.up="console.log('up')"/>
        <button class="w-5/6 py-2" @click="submit">submit</button>
    </div>
</template>