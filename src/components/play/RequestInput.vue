<script setup lang="ts">
import { countBy } from "lodash-es"

import { useSound } from "@vueuse/sound"

import numbersJson from "@/assets/data/numbers.json"
import numbersSfx from "@/assets/data/numbers.mp3"

import timeJson from "@/assets/data/time.json"
import timeSfx from "@/assets/data/time.mp3"

const cantoinput = ref("")
const romanizedText = ref({})
const errorMsg = ref("")

const integerObj = {
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

const playIntegerState = ref(false)
const { play: playInteger } = useSound(numbersSfx, {
    sprite: integerObj.spriteMap,
    interrupt: false,
	onend: () => {
		playIntegerState.value = false
	},
})

const playTimeState = ref(false)
const { play: playTime } = useSound(timeSfx, {
    sprite: timeObj.spriteMap,
    interrupt: false,
	onend: () => {
		playTimeState.value = false
	},
})

// https://stackoverflow.com/questions/22125865/how-to-wait-until-a-predicate-condition-becomes-true-in-javascript/72350987#72350987
const playIntegerSounds = async (soundIds: Array<String>) => {
	for (let id of soundIds) {
		playIntegerState.value = true
		playInteger({id: id})
		await until(() => { return playIntegerState.value == false })
	}
}

const playTimeSounds = async (soundIds: Array<String>) => {
	for (let id of soundIds) {
		playTimeState.value = true
		playTime({id: id})
		await until(() => { return playTimeState.value == false })
	}
}

const until = (func) => {
	const poll = (done) => (func() ? done() : setTimeout(() => poll(done), 10))
	return new Promise(poll)
}

const splitInteger = (digits: Array<String>) => {
    let newDigits = digits

	// if all the elements in digits contains "0" then just return an empty array
	if (newDigits.every((element) => element == "0")) return []

	let cutDigits = []
	let newIds = []
	let pos = digits.length - 1
	if (digits.length >= 9) { // call splitNumberRecu for numbers above 100,000,000 to apply pattern
		cutDigits = digits.slice(0, digits.length - 9 + 1)
		newDigits = digits.slice(digits.length - 9 + 1, digits.length)
		pos = newDigits.length - 1
		newIds.push(...splitInteger(cutDigits))
		newIds.push("100000000") 
	} else if (digits.length >= 5) { // call splitNumberRecu for numbers above 10,000 to apply pattern
		cutDigits = digits.slice(0, digits.length - 5 + 1)
		newDigits = digits.slice(digits.length - 5 + 1, digits.length)
		pos = newDigits.length - 1
		newIds.push(...splitInteger(cutDigits))
		newIds.push("10000")
	}

	if (pos >= 5) { // if after the cut, digits still exceed more than 4, then shorten it again
		// this check makes sure if the number is beyond 100,000,000, it will still  check the values at 10,000+
		newIds.push(...splitInteger(newDigits))
	} else { // number pattern from 0 to 9999
		for (let id of newDigits) {
			if (id == "0") {
				if (newIds[newIds.length-1] != "0" && pos > 0) newIds.push("0")
			} else if (pos == 3) {
				newIds.push(id)
				newIds.push("1000")
			} else if (pos == 2) {
				newIds.push(id)
				newIds.push("100")
			} else if (pos == 1) {
				if (id != "1") newIds.push(id)
				newIds.push("10")
			} else {
				newIds.push(id)
			}
			pos -= 1
		}

		if (newIds.length > 1 && newIds[newIds.length-1] == "0") newIds.pop()
	}

	return newIds
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

    if (props.inputCategory == "integer") {
        console.log("generate audio for integer")
        if (digits.length == 1) {
            newIds.value.push(...digits)
        } else {
            newIds.value.push(...splitInteger(digits))
        }

    } else if (props.inputCategory == "time") {
        console.log("generate audio for time")
        newIds.value.push(...splitTime(digits))

    } else if (props.inputCategory == "money") {
        console.log("generate audio for money")
        // TODO
    }

    return newIds
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
        default: "integer",
        validator(value: string) {
            return ["integer", "time", "money"].includes(value)
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
    if (props.inputCategory == "integer") {
        romanizedText.value = {
			traditional: ids.map((element) => {return integerObj.traditional[element]}).join(" "),
			jyutping: ids.map((element) => {return integerObj.jyutping[element]}).join(" "),
			yale: ids.map((element) => {return integerObj.yale[element]}).join(" ")
		}
    } else if (props.inputCategory == "time") {
        romanizedText.value = {
			traditional: ids.map((element) => {return timeObj.traditional[element]}).join(" "),
			jyutping: ids.map((element) => {return timeObj.jyutping[element]}).join(" "),
			yale: ids.map((element) => {return timeObj.yale[element]}).join(" ")
		}
    } else if (props.inputCategory == "money") {
        console.log("generate text money")
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
    console.log("submit request: ", requestVal)
    const newIds = ref(generateAudioIds(requestVal))
    generateRomanizedText(newIds.value)
    console.log(newIds.value)
    play(newIds.value)
}

const play = (ids: Array<String>) => {
    console.log(ids)
    if (props.inputCategory == "integer") {
        console.log("play integer")
        playIntegerSounds(ids)
    } else if (props.inputCategory == "time") {
        console.log("play time")
        playTimeSounds(ids)
    } else if (props.inputCategory == "money") {
        console.log("play money")
    }
}

const validateInput = () => {
    let inputVal = cantoinput.value
    if (props.inputCategory == "integer") {
        console.log("validate integer")
        if (Number(inputVal) == parseInt(inputVal) && parseInt(inputVal) <= 999999999999 && parseInt(inputVal) >= 0) {
            return inputVal
        } else {
            errorMsg.value = `${inputVal} is not a valid integer between 0 and 1 trillion`
        }
    } else if (props.inputCategory == "time") {
        console.log("validate time")
        const regex = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/gm
        if (regex.test(inputVal)) {
            return inputVal.length == 5 ? inputVal : "0"+inputVal
        } else {
            errorMsg.value = `Input must be in the 12-hour format hh:mm or h:mm`
        }

    } else if (props.inputCategory == "money") {
        console.log("validate money")
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

        if (props.inputCategory == "integer") {
            console.log("check integer")
            allowed.value = Number.isInteger(parseInt(event.data))
        } else if (props.inputCategory == "time") {
            console.log("check time")
            allowed.value = Number.isInteger(parseInt(event.data)) || (event.data == ":" && countBy(cantoinput.value)[":"] == 1)
        } else if (props.inputCategory == "money") {
            console.log("check money")
            allowed.value = Number.isInteger(parseInt(event.data)) || event.data == "."
        }

        if (!allowed.value) {
            errorMsg.value = "The character '" + event.data + "' is not allowed"
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