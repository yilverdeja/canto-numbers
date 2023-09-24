<script setup lang="ts">
import { useDataObjects } from '@/composables/useDataObjects'
import { usePlaySequence } from '@/composables/usePlaySequence'
import { useIntegers } from '@/composables/useIntegers'
import { useTime } from '@/composables/useTime'
import { useMoney } from '@/composables/useMoney'
import { useDigits } from '@/composables/useDigits'

import numbersJson from "@/assets/data/numbers.json"
import numbersSfx from "@/assets/data/numbers.mp3"

import timeJson from "@/assets/data/time.json"
import timeSfx from "@/assets/data/time.mp3"

const cantoinput = ref("")
const romanizedText = ref({})
const errorMsg = ref("")

const { getDataObj, generateRomanizedText: grt } = useDataObjects()
const integersObj = getDataObj(numbersJson)
const timeObj = getDataObj(timeJson)
const { stopSequence: stopIntegerSequence, playSequence: playIntegerSequence } = usePlaySequence({sfx: numbersSfx, spriteMap: integersObj.spriteMap})
const { stopSequence: stopTimeSequence, playSequence: playTimeSequence } = usePlaySequence({sfx: timeSfx, spriteMap: timeObj.spriteMap})
const { generateIntegerIds, checkIntegers , validateIntegers, generateRandomInteger } = useIntegers()
const { generateTimeIds, checkTime , validateTime, generateRandomTime } = useTime()
const { generateMoneyIds, checkMoney , validateMoney, generateRandomMoney } = useMoney()
const { generateDigitsIds, checkDigits , validateDigits , generateRandomDigits } = useDigits()

const generateRandom = () => {
    if (props.inputCategory == "integers") {
        return generateRandomInteger(props.options)

    } else if (props.inputCategory == "time") {
        return generateRandomTime(props.options)

    } else if (props.inputCategory == "money") {
        return generateRandomMoney(props.options)

    } else if (props.inputCategory == "digits") {
        return generateRandomDigits(props.options)
    }
}

const generateAudioIds = (numValue: string) => {

    if (props.inputCategory == "integers") {
        return generateIntegerIds(numValue)

    } else if (props.inputCategory == "time") {
        return generateTimeIds(numValue)

    } else if (props.inputCategory == "money") {
        return generateMoneyIds(numValue)

    } else if (props.inputCategory == "digits") {
        return generateDigitsIds(numValue)

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
            return ["integers", "time", "money", "digits"].includes(value)
        },
        required: true
    },
    options: {
        type: Object,
        default: null
    }

})

const submitGuess = (guessVal: string) => {
    if (!Number.isNaN(Number(guessVal))) {
        Number(guessVal) === Number(currValue.value) ? emit("response", true, currValue.value) : emit("response", false, currValue.value)
    } else {
        guessVal === currValue.value ? emit("response", true, currValue.value) : emit("response", false, currValue.value)
    }
}

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
        romanizedText.value = grt(ids, integersObj)
    } else if (props.inputCategory == "digits") {
        romanizedText.value = grt(ids, integersObj)
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

const play = () => {
    if (props.inputCategory == "integers") {
        playIntegerSequence(currValueIds.value)
    } else if (props.inputCategory == "time") {
        playTimeSequence(currValueIds.value)
    } else if (props.inputCategory == "money") {
        playIntegerSequence(currValueIds.value)
    } else if (props.inputCategory == "digits") {
        playIntegerSequence(currValueIds.value)
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
        const {validation, errorMessage } = validateMoney(inputVal)
        if (validation.value) return inputVal
        else errorMsg.value = errorMessage.value

    } else if (props.inputCategory == "digits") {
        const {validation, errorMessage } = validateDigits(inputVal)
        if (validation.value) return inputVal
        else errorMsg.value = errorMessage.value
    }

    return null
}

const submit = () => {
    let inputVal = validateInput()
    if (inputVal) {
        clearRomanizedText()
        submitGuess(inputVal)
        cantoinput.value = ""
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
            allowed.value = checkMoney(cantoinput.value)
        } else if (props.inputCategory == "digits") {
            allowed.value = checkDigits(event.data, cantoinput.value)
        }

        if (!allowed.value) {
            if (!["h", "r", " "].includes(event.data)) {
                errorMsg.value = "The character '" + event.data + "' is not allowed"
            }
            cantoinput.value = cantoinput.value.substring(0, cantoinput.value.length - 1)
        }
    }

}

const currValue = ref("")
const currValueIds = ref<Array<String>>([])

const generateNewValue = () => {
    currValue.value = generateRandom()
    currValueIds.value = generateAudioIds(currValue.value)
    generateRomanizedText(currValueIds.value)
}


const emit = defineEmits<{
    (e: "response", correct: boolean, value: string): void
}>()

onMounted(() => {
    currValue.value = generateRandom()
    currValueIds.value = generateAudioIds(currValue.value)
    generateRomanizedText(currValueIds.value)
})

const guessInput = ref(null)
const focusInput = () => {
    if (guessInput.value) {
        guessInput.value.focus()
    }
}

const stopSequence = () => {
    if (props.inputCategory == "integers") {
        stopIntegerSequence()
    } else if (props.inputCategory == "time") {
        stopTimeSequence()
    } else if (props.inputCategory == "money") {
        stopIntegerSequence()
    } else if (props.inputCategory == "digits") {
        stopIntegerSequence()
    }
}

defineExpose({generateNewValue, getRomanizedText, play, focusInput, submit, stopSequence})

</script>

<template>
    <div>
        <input ref="guessInput" v-model="cantoinput" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="text" autofocus @keyup.enter="submit" @input="check"/>
        <div v-if="errorMsg != ''" class="text-[#ee2200]">{{ errorMsg }}</div>
    </div>
</template>