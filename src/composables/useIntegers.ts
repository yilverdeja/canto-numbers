
export function useIntegers() {

    const splitIds = (digits: Array<String>) => {
        let newDigits = digits
    
        // if all the elements in digits contains "0" then just return an empty array
        if (newDigits.every((element) => element == "0")) return []
    
        let cutDigits = []
        const newIds = []
        let pos = digits.length - 1
        if (digits.length >= 9) { // call splitNumberRecu for numbers above 100,000,000 to apply pattern
            cutDigits = digits.slice(0, digits.length - 9 + 1)
            newDigits = digits.slice(digits.length - 9 + 1, digits.length)
            pos = newDigits.length - 1
            newIds.push(...splitIds(cutDigits))
            newIds.push("100000000") 
        } else if (digits.length >= 5) { // call splitNumberRecu for numbers above 10,000 to apply pattern
            cutDigits = digits.slice(0, digits.length - 5 + 1)
            newDigits = digits.slice(digits.length - 5 + 1, digits.length)
            pos = newDigits.length - 1
            newIds.push(...splitIds(cutDigits))
            newIds.push("10000")
        }
    
        if (pos >= 5) { // if after the cut, digits still exceed more than 4, then shorten it again
            // this check makes sure if the number is beyond 100,000,000, it will still  check the values at 10,000+
            newIds.push(...splitIds(newDigits))
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

    const generateRandom = (options: {max: number, min: number}) => {
        return (Math.floor(Math.random() * (options.max - options.min + 1)) + options.min).toString()
    }

    const generateIds = (input: string) => {
        const digits = input.split("")
        const newIds = []
        if (digits.length == 1) {
            newIds.push(...digits)
        } else {
            newIds.push(...splitIds(digits))
        }

        return newIds
    }

    const checkInput = (character: string) => {
        return Number.isInteger(parseInt(character))
    }

    const validateInput = (input: string) => {
        const validation = ref(false)
        const errorMessage = ref<String|null>(null)

        validation.value = Number(input) == parseInt(input) && parseInt(input) <= 999999999999 && parseInt(input) >= 0
        if (!validation.value) {
            errorMessage.value = "the input must be between 0 and 1 trillion"
        }

        return {validation, errorMessage}
    }

    return {generateIntegerIds: generateIds, checkIntegers: checkInput, validateIntegers: validateInput, generateRandomInteger: generateRandom}

}