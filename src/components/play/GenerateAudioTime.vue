<script setup lang="ts">
import { useSound } from "@vueuse/sound"
import timeJson from "@/assets/data/time.json"
import timeSfx from "@/assets/data/time.mp3"

const spriteMap = timeJson.reduce((obj, item) => {
    obj[item.number] = item.sprite
    return obj
}, {})

const numbersJyutping = timeJson.reduce((obj, item) => {
    obj[item.number] = item.jyutping
    return obj
}, {})

const numbersYale = timeJson.reduce((obj, item) => {
    obj[item.number] = item.yale
    return obj
}, {})

const numbersTraditional = timeJson.reduce((obj, item) => {
    obj[item.number] = item.traditional
    return obj
}, {})

const answer = ref({})
const answerError = ref("")
const playState = ref(false)
const { play } = useSound(timeSfx, {
    sprite: spriteMap,
    interrupt: false,
	onend: () => {
		playState.value = false
	},
})

const splitNumberRecu = (digits: Array<String>) => {
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

const splitNumber = (val) => {
	const digits = val.toString().split("")
    const newIds = []
    newIds.push(...splitNumberRecu(digits))

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
	const ids = splitNumber(num.length == 4 ? "0"+num : num)
	console.log(ids)
	answer.value = {
		traditional: ids.map((element) => {return numbersTraditional[element]}),
		jyutping: ids.map((element) => {return numbersJyutping[element]}),
		yale: ids.map((element) => {return numbersYale[element]})
	}
	answerError.value = ""

	playSounds(ids)
}

const getRomanization = (hintType: string) => {
	if (Object.keys(answer.value).length == 0) return ""
	if (["jyutping", "yale", "traditional"].includes(hintType)) {
		return (answer.value)[hintType].join(" ")
	} else {
		return ""
	}
	
}

defineExpose({generateAudioNumbers, getRomanization})

defineProps({
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
})

</script>

<template>
    <div v-if="showJyutping">{{ getRomanization("jyutping") }}</div>
	<div v-if="showYale">{{ getRomanization("yale") }}</div>
	<div v-if="showTraditional">{{ getRomanization("traditional") }}</div>
</template>