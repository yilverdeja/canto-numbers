
export function useDigits() {

    const generateRandom = (options) => {
        if ('maxRange' in options && 'minRange' in options) {
            return (Math.floor(Math.random() * (options.maxRange - options.minRange + 1)) + options.minRange).toString()
        } else if ('maxDigits' in options && 'minDigits' in options) {
            const numDigits = Math.floor(Math.random() * (options.maxDigits - options.minDigits + 1)) + options.minDigits

            const digits = []
            for (let i = 0; i < numDigits; i++){
                const randomInteger = (Math.floor(Math.random() * 10)).toString() // 0 - 9
                digits.push(randomInteger)
            }

            return digits.join("")
        }
        
    }

    const generateIds = (input: string) => {
        const digits = input.split("")
        const newIds = []
        newIds.push(...digits)

        return newIds
    }

    const checkInput = (character: string) => {
        return Number.isInteger(parseInt(character))
    }

    const validateInput = (input: string) => {
        const validation = ref(false)
        const errorMessage = ref<String|null>(null)

        validation.value = Number(input) == parseInt(input) && parseInt(input) >= 0
        if (!validation.value) {
            errorMessage.value = "the input must contain only digits from 0 to 9"
        }

        return {validation, errorMessage}
    }

    return {generateDigitsIds: generateIds, checkDigits: checkInput, validateDigits: validateInput, generateRandomDigits: generateRandom}

}