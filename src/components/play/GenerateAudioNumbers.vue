<script setup lang="ts">
import { useSound } from "@vueuse/sound"
import numbersJson from "@/assets/data/numbers.json"
import numbersSfx from "@/assets/data/numbers.mp3"

const spriteMap = numbersJson.reduce((obj, item) => {
    obj[item.number] = item.sprite
    return obj
}, {})

const numbersJyutping = numbersJson.reduce((obj, item) => {
    obj[item.number] = item.jyutping
    return obj
}, {})

const numbersYale = numbersJson.reduce((obj, item) => {
    obj[item.number] = item.yale
    return obj
}, {})

const numbersTraditional = numbersJson.reduce((obj, item) => {
    obj[item.number] = item.traditional
    return obj
}, {})

const answer = ref("")
const playState = ref(false)
const { play } = useSound(numbersSfx, {
    sprite: spriteMap,
    interrupt: false,
	onend: () => {
		playState.value = false
	},
})

// applies number patterns from 0 to 9999 with 10,000 and 100,000,000 by splitting the number in section
const splitNumberRecu = (digits: Array<String>) => {
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
		newIds.push(...splitNumberRecu(cutDigits))
		newIds.push("100000000") 
	} else if (digits.length >= 5) { // call splitNumberRecu for numbers above 10,000 to apply pattern
		cutDigits = digits.slice(0, digits.length - 5 + 1)
		newDigits = digits.slice(digits.length - 5 + 1, digits.length)
		pos = newDigits.length - 1
		newIds.push(...splitNumberRecu(cutDigits))
		newIds.push("10000")
	}

	if (pos >= 5) { // if after the cut, digits still exceed more than 4, then shorten it again
		// this check makes sure if the number is beyond 100,000,000, it will still  check the values at 10,000+
		newIds.push(...splitNumberRecu(newDigits))
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

const splitNumber = (val) => {
	const digits = val.toString().split("")
    const newIds = []
    if (digits.length == 1) {
        newIds.push(...digits)
    } else {
        newIds.push(...splitNumberRecu(digits))
    }

	return newIds
	
}

// https://stackoverflow.com/questions/22125865/how-to-wait-until-a-predicate-condition-becomes-true-in-javascript/72350987#72350987
const playSounds = async (soundIds: Array<String>) => {
	for (let id of soundIds) {
		playState.value = true
		play({id: id})
		await until(() => { return playState.value == false })
	}
}

const until = (func) => {
	const poll = (done) => (func() ? done() : setTimeout(() => poll(done), 10))
	return new Promise(poll)
}

const generateAudioNumbers = (num) => {
	if (num < 0 || num > 999999999999) {
		answer.value = "sorry, value must be between 0 and 999999999999"
	} else {
		const ids = splitNumber(num)
		answer.value = ids.map((element) => {
			if (props.hintType == "traditional") {
				return numbersTraditional[element]
			} else if (props.hintType == "yale") {
				return numbersYale[element]
			} else {
				return numbersJyutping[element]
			}
		}).join(" ")
		playSounds(ids)
	}
}

const getRomanization = () => {
	return answer.value
}

defineExpose({generateAudioNumbers, getRomanization})

const props = defineProps({
	hintType: {
		type: String,
		default: "jyutping"
	},
    show: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
    <div v-if="show">{{answer}}</div>
</template>