<script setup lang="ts">
import numbersJson from "@/assets/data/numbers.json"
import numbersSfx from "@/assets/data/numbers.mp3"

import timeJson from "@/assets/data/time.json"
import timeSfx from "@/assets/data/time.mp3"

import { useDataObjects } from '@/composables/useDataObjects'
import { usePlaySequence } from '@/composables/usePlaySequence'
import { useIntegers } from '@/composables/useIntegers'
import { useTime } from '@/composables/useTime'

const cantoinput = ref("")
const romanizedText = ref({})
const errorMsg = ref("")

const { getDataObj, generateRomanizedText: grt } = useDataObjects()
const integersObj = getDataObj(numbersJson)
const timeObj = getDataObj(timeJson)
const { playSequence: playIntegerSequence } = usePlaySequence({sfx: numbersSfx, spriteMap: integersObj.spriteMap})
const { playSequence: playTimeSequence } = usePlaySequence({sfx: timeSfx, spriteMap: timeObj.spriteMap})
const { generateIntegerIds, checkIntegers , validateIntegers } = useIntegers()
const { generateTimeIds, checkTime , validateTime } = useTime()

const generateAudioIds = (numValue: string) => {

    if (props.inputCategory == "integers") {
        return generateIntegerIds(numValue)

    } else if (props.inputCategory == "time") {
        return generateTimeIds(numValue)

    } else if (props.inputCategory == "money") {
        // TODO
    }

    return []
}

const props = defineProps({
    showJyutping: {
        type: Boolean,
        default: false
    },
    showYale: {
        type: Boolean,
        default: false
    },
    showTraditional: {
        type: Boolean,
        default: false
    },
    showError: {
        type: Boolean,
        default: true
    },
    inputCategory: {
        type: String,
        default: "integers",
        validator(value: string) {
            return ["integers", "time", "money"].includes(value)
        },
        required: true
    },

})

const clearRomanizedText = () => {
    romanizedText.value = {
        traditional: "",
        jyutping: "",
        yale: ""
    }
}

const generateRomanizedText = (ids: Array<String>) => {
    if (props.inputCategory == "integers") {
        romanizedText.value = grt(ids, integersObj)
    } else if (props.inputCategory == "time") {
        romanizedText.value = grt(ids, timeObj)
    } else if (props.inputCategory == "money") {
        // TODO
    }
}

const getRomanizedText = (romanization: string) => {
    if (Object.keys(romanizedText.value).length == 0) return ""
	if (["jyutping", "yale", "traditional"].includes(romanization)) {
		return (romanizedText.value)[romanization]
	} else {
		return ""
	}
}

const submitRequest = (requestVal: string) => {
    const newIds = ref(generateAudioIds(requestVal))
    generateRomanizedText(newIds.value)
    play(newIds.value)
}

const play = (ids: Array<String>) => {
    if (props.inputCategory == "integers") {
        playIntegerSequence(ids)
    } else if (props.inputCategory == "time") {
        playTimeSequence(ids)
    } else if (props.inputCategory == "money") {
        // TODO
    }
}

const validateInput = () => {
    let inputVal = cantoinput.value
    if (props.inputCategory == "integers") {
        const {validation, errorMessage } = validateIntegers(inputVal)
        if (validation.value) return inputVal
        else errorMsg.value = errorMessage.value
    } else if (props.inputCategory == "time") {
        const {validation, errorMessage } = validateTime(inputVal)
        if (validation.value) return inputVal.padStart(5, "0")
        else errorMsg.value = errorMessage.value

    } else if (props.inputCategory == "money") {
        // TODO
    }

    return null
}

const submit = () => {
    clearRomanizedText()
    let inputVal = validateInput()
    if (inputVal) {
        submitRequest(inputVal)
    }
}

const check = (event: Event) => {
    const allowed = ref(false)
    errorMsg.value = ""

    if (event.data) {

        if (props.inputCategory == "integers") {
            allowed.value = checkIntegers(event.data)
        } else if (props.inputCategory == "time") {
            allowed.value = checkTime(event.data, cantoinput.value)
        } else if (props.inputCategory == "money") {
            // TODO
        }

        if (!allowed.value) {
            if (![" "].includes(event.data)) {
                errorMsg.value = "The character '" + event.data + "' is not allowed"
            }
            cantoinput.value = cantoinput.value.substring(0, cantoinput.value.length - 1)
        }
    }

}

const guessInput = ref(null)
const focusInput = () => {
    if (guessInput.value) {
        guessInput.value.focus()
    }
}

defineExpose({submit, focusInput})

</script>

<template>
    <div>
        <input ref="guessInput" v-model="cantoinput" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="text" placeholder="input" autofocus @keyup.enter="submit" @input="check"/>
        <div v-if="errorMsg != ''" class="text-[#ee2200]">{{ errorMsg }}</div>
        <div v-if="showJyutping">{{ getRomanizedText("jyutping") }}</div>
        <div v-if="showYale">{{ getRomanizedText("yale") }}</div>
        <div v-if="showTraditional">{{ getRomanizedText("traditional") }}</div>
    </div>
</template>