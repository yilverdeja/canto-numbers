import { countBy } from "lodash-es"
export function useTime() {

    const splitIds = (digits: Array<String>) => {
        let newIds = []
    
        if (digits.length == 5) {
    
            if (digits[0] != "0") {
                newIds.push("10")
            }
            if (digits[1] != "0") {
                // 2:00 should use loeng5 
                if (digits[0] == "0" && digits[1] == "2") newIds.push("two")
                else newIds.push(digits[1])
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

    const generateRandom = (options: {maxHour: number, minHour: number, maxMinute: number, minMinute: number}) => {
        const randomHour = (Math.floor(Math.random() * (options.maxHour - options.minHour + 1)) + options.minHour).toString().padStart(2, "0")
        const randomMinute = (Math.floor(Math.random() * (options.maxMinute - options.minMinute + 1)) + options.minMinute).toString().padStart(2, "0")

        return `${randomHour}:${randomMinute}`
    }

    const generateIds = (input: string) => {
        const digits = input.split("")
        const newIds = []
        newIds.push(...splitIds(digits))

        return newIds
    }

    const checkInput = (character: string, input: string) => {
        return Number.isInteger(parseInt(character)) || (character == ":" && countBy(input)[":"] == 1)
    }

    const validateInput = (input: string) => {
        const validation = ref(false)
        const errorMessage = ref<String|null>(null)

        validation.value = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/gm.test(input)
        if (!validation.value) {
            errorMessage.value = "the input must be in a 12-hour format hh:mm or h:mm"
        }

        return {validation, errorMessage}
    }

    return {generateTimeIds: generateIds, checkTime: checkInput, validateTime: validateInput, generateRandomTime: generateRandom}

}