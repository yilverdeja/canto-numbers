import { countBy, indexOf } from "lodash-es"
export function useMoney() {

    const splitDollarIds = (digits: Array<String>) => {
        let newDigits = [...digits]
    
        // if all the elements in digits contains "0" then just return an empty array
        if (newDigits.every((element) => element == "0")) return []
    
        let cutDigits = []
        let newIds = []
        let pos = digits.length - 1
        if (digits.length >= 9) { // call splitNumberRecu for numbers above 100,000,000 to apply pattern
            cutDigits = digits.slice(0, digits.length - 9 + 1)
            newDigits = digits.slice(digits.length - 9 + 1, digits.length)
            pos = newDigits.length - 1
            newIds.push(...splitDollarIds(cutDigits))
            newIds.push("100000000") 
        } else if (digits.length >= 5) { // call splitNumberRecu for numbers above 10,000 to apply pattern
            cutDigits = digits.slice(0, digits.length - 5 + 1)
            newDigits = digits.slice(digits.length - 5 + 1, digits.length)
            pos = newDigits.length - 1
            newIds.push(...splitDollarIds(cutDigits))
            newIds.push("10000")
        }
    
        if (pos >= 5) { // if after the cut, digits still exceed more than 4, then shorten it again
            // this check makes sure if the number is beyond 100,000,000, it will still  check the values at 10,000+
            newIds.push(...splitDollarIds(newDigits))
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

    const splitCentIds = (digits: Array<String>) => {
        const newDigits = [...digits]

        const newIds = []

        if (newDigits.join("") === "50") {
            newIds.push("half")
        } else {
            newIds.push(digits[0])
            newIds.push("dime")
            if (digits[1] != "0") {
                newIds.push(digits[1])
            }
        }

        return newIds
    }

    const generateRandom = (options: {max: number, min: number}) => {
        const randomVal = Math.random() * (options.max - options.min + 0.01) + options.min
        const decimalVal = Math.floor(randomVal * 100) / 100
        return decimalVal.toString()
    }

    const generateIds = (input: string) => {
        const newIds = []
        const digits = input.split("")
        const inputNumber = Number(input)
        const indexOfPoint = input.indexOf(".")

        if (Number.isInteger(inputNumber)) {
            if (indexOfPoint > 0) {
                newIds.push(...splitDollarIds(digits.slice(0, indexOfPoint)))
            } else {
                newIds.push(...splitDollarIds(digits))
            }
            newIds.push("dollar")

        } else if (!Number.isNaN(inputNumber)) { // float
            if (inputNumber == 1.5) {
                newIds.push("dollar")
                newIds.push("half")
                return newIds
            }

            const centDigits = digits.slice(indexOfPoint+1)
            if (centDigits.length == 1) centDigits.push("0")

            if (inputNumber >= 1) { // dollars and cents
                newIds.push(...splitDollarIds(digits.slice(0, indexOfPoint)))
                newIds.push("dollar")
                newIds.push(...splitCentIds(centDigits))

            } else { // cents
                if (centDigits[0] == "0") {
                    newIds.push(centDigits[1] == "2" ? "two" : centDigits[1])
                    newIds.push("cent")
                } else if (centDigits[1] == "0") {
                    newIds.push(centDigits[0] == "2" ? "two" : centDigits[0])
                    newIds.push("dime")
                    newIds.push("whole-dime")
                } else {
                    newIds.push(centDigits[0] == "2" ? "two" : centDigits[0])
                    newIds.push("dime")
                    newIds.push(centDigits[1] == "5" ? "half" : centDigits[1])

                }
            }
        } else {
            console.log("cannot generate id's for input: ", input)
        }

        if (newIds.findIndex(e => e == "dollar") > 0 && newIds[0] == "2" && newIds[1] != "10") {
            newIds[0] = "two"
        }
        return newIds
    }

    const checkInput = (input: string) => {
        const inputIsNum = !Number.isNaN(Number(input)) && (Math.floor(Number(input)*100)/100) == Number(input)
        if (inputIsNum) {
            const indexOfPoint = input.indexOf(".")
            if (indexOfPoint >= 0) {
                return indexOfPoint >= input.length-3
            } else {
                return true
            }
        } else {
            return false
        }
    }

    const validateInput = (input: string) => {
        const validation = ref(false)
        const errorMessage = ref<String|null>(null)

        validation.value = !Number.isNaN(Number(input)) && Number(input) <= 1000000 && Number(input) > 0
        if (!validation.value) {
            errorMessage.value = "the input must be more than 0 and up to 1 million with up to 2 decimal places"
        }

        return {validation, errorMessage}
    }

    return {generateMoneyIds: generateIds, checkMoney: checkInput, validateMoney: validateInput, generateRandomMoney: generateRandom}

}