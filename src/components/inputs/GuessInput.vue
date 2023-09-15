<script setup lang="ts">
import { countBy } from "lodash-es"
import { usePlaySequence } from '@/composables/usePlaySequence'
import { useIntegers } from '@/composables/useIntegers'

import numbersJson from "@/assets/data/numbers.json"
import numbersSfx from "@/assets/data/numbers.mp3"

import timeJson from "@/assets/data/time.json"
import timeSfx from "@/assets/data/time.mp3"

const cantoinput = ref("")
const romanizedText = ref({})
const errorMsg = ref("")

const integersObj = {
    spriteMap: numbersJson.reduce((obj, item) => {
        obj[item.number] = item.sprite
        return obj
    }, {}),
    jyutping: numbersJson.reduce((obj, item) => {
        obj[item.number] = item.jyutping
        return obj
    }, {}),
    yale: numbersJson.reduce((obj, item) => {
        obj[item.number] = item.yale
        return obj
    }, {}),
    traditional: numbersJson.reduce((obj, item) => {
        obj[item.number] = item.traditional
        return obj
    }, {})
}

const timeObj = {
    spriteMap: timeJson.reduce((obj, item) => {
        obj[item.number] = item.sprite
        return obj
    }, {}),
    jyutping: timeJson.reduce((obj, item) => {
        obj[item.number] = item.jyutping
        return obj
    }, {}),
    yale: timeJson.reduce((obj, item) => {
        obj[item.number] = item.yale
        return obj
    }, {}),
    traditional: timeJson.reduce((obj, item) => {
        obj[item.number] = item.traditional
        return obj
    }, {})
}

const { playSequence: playIntegerSequence } = usePlaySequence({sfx: numbersSfx, spriteMap: integersObj.spriteMap})
const { playSequence: playTimeSequence } = usePlaySequence({sfx: timeSfx, spriteMap: timeObj.spriteMap})
const { generateIntegerIds, checkIntegers , validateIntegers, generateRandomInteger } = useIntegers()

const generateRandom = () => {
    if (props.inputCategory == "integers") {
        return generateRandomInteger(props.options)

    } else if (props.inputCategory == "time") {
        let randomHour = (Math.floor(Math.random() * (props.options.maxHour - props.options.minHour + 1)) + props.options.minHour).toString().padStart(2, "0")
        let randomMinute = (Math.floor(Math.random() * (props.options.maxMinute - props.options.minMinute + 1)) + props.options.minMinute).toString().padStart(2, "0")

        return `${randomHour}:${randomMinute}`

    } else if (props.inputCategory == "money") {
        return (1.5).toString() // TODO

    }
}

const splitTime = (digits: Array<String>) => {
    let newIds = []

	if (digits.length == 5) {

		if (digits[0] != "0") {
			newIds.push("10")
		}
		if (digits[1] != "0") {
			newIds.push(digits[1])
		}
		newIds.push(":") // digits[2]

		let minutesStr = [digits[3], digits[4]].join("")
		let minutesInt = parseInt(minutesStr)

		if (minutesInt == "00") {
			return newIds
		} else if (minutesInt == "30") {
			newIds.push("half")
		} else if (minutesInt % 5 == 0) {
			let fiveCount = (minutesInt/5)
			if (fiveCount >= 11) {
				newIds.push("10")
				newIds.push("1")
			} else {
				newIds.push(fiveCount.toString())
			}
			
		} else {
			if (digits[3] == "0") {
				newIds.push("0")
			} else {
				if (digits[3] != "1") {
					newIds.push(digits[3])
				}
				newIds.push("10")
			}
			newIds.push(digits[4])
			newIds.push("minute")
		}

	} else {
		return []
	}

	return newIds
}

const generateAudioIds = (numValue: string) => {
    const digits = numValue.split("")
    const newIds = ref<String[]>([])

    if (props.inputCategory == "integers") {
        return generateIntegerIds(numValue).value

    } else if (props.inputCategory == "time") {
        newIds.value.push(...splitTime(digits))

    } else if (props.inputCategory == "money") {
        // TODO
    }

    return newIds.value
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
    options: {
        type: Object,
        default: null
    }

})

const submitGuess = (guessVal: string) => {
    guessVal === currValue.value ? emit("response", true, currValue.value) : emit("response", false, currValue.value)
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
        romanizedText.value = {
			traditional: ids.map((element) => {return integersObj.traditional[element]}).join(" "),
			jyutping: ids.map((element) => {return integersObj.jyutping[element]}).join(" "),
			yale: ids.map((element) => {return integersObj.yale[element]}).join(" ")
		}
    } else if (props.inputCategory == "time") {
        romanizedText.value = {
			traditional: ids.map((element) => {return timeObj.traditional[element]}).join(" "),
			jyutping: ids.map((element) => {return timeObj.jyutping[element]}).join(" "),
			yale: ids.map((element) => {return timeObj.yale[element]}).join(" ")
		}
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

const play = () => {
    if (props.inputCategory == "integers") {
        playIntegerSequence(currValueIds.value)
    } else if (props.inputCategory == "time") {
        playTimeSequence(currValueIds.value)
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
        const regex = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/gm
        if (regex.test(inputVal)) {
            return inputVal.length == 5 ? inputVal : "0"+inputVal
        } else {
            errorMsg.value = `Input must be in the 12-hour format hh:mm or h:mm`
        }

    } else if (props.inputCategory == "money") {
        // TODO
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
            allowed.value = Number.isInteger(parseInt(event.data)) || (event.data == ":" && countBy(cantoinput.value)[":"] == 1)
        } else if (props.inputCategory == "money") {
            allowed.value = Number.isInteger(parseInt(event.data)) || event.data == "."
        }

        if (!allowed.value) {
            if (!["h", "r", " "].includes(event.data)) {
                errorMsg.value = "The character '" + event.data + "' is not allowed"
            }
            cantoinput.value = cantoinput.value.substring(0, cantoinput.value.length - 1)
        }
    }

}

const generateNewValue = () => {
    currValue.value = generateRandom()
    console.log(currValue.value)
    currValueIds.value = generateAudioIds(currValue.value)
    generateRomanizedText(currValueIds.value)
}


const emit = defineEmits<{
    (e: "response", correct: boolean, value: string): void
}>()

const currValue = ref("")
const currValueIds = ref<Array<String>>([])

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

defineExpose({generateNewValue, getRomanizedText, play, focusInput, submit})

</script>

<template>
    <div>
        <input ref="guessInput" v-model="cantoinput" class="text-5xl sm:text-8xl text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-transparent" type="text" placeholder="input" autofocus @keyup.enter="submit" @input="check"/>
        <div v-if="errorMsg != ''" class="text-[#ee2200]">{{ errorMsg }}</div>
    </div>
</template>