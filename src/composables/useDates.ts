import { countBy } from "lodash-es"
import dayjs from 'dayjs'
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
export function useDates() {

    const splitIds = (digits: Array<String>) => {
        const newIds = []
    
        if (digits[0] != "0") {
            if (digits[0] != "1") newIds.push(digits[0])
            newIds.push("10")
        }

        if (digits[1] != "0") newIds.push(digits[1])
    
        return newIds
    }

    const generateRandom = (options: {minMonth: number, maxMonth: number, minDay: number, maxDay: number}) => {
        const randomMonth = (Math.floor(Math.random() * (options.maxMonth - options.minMonth + 1)) + options.minMonth).toString().padStart(2, "0")
        const randomDay = (Math.floor(Math.random() * (options.maxDay - options.minDay + 1)) + options.minDay).toString().padStart(2, "0")
        console.log(`${randomDay}/${randomMonth}`)

        return dayjs(`${2020}-${randomMonth}-${randomDay}`, "YYYY-MM-DD", true).isValid() ? `${randomDay}/${randomMonth}` : generateRandom(options)
    }

    const generateIds = (input: string) => {
        const digits = input.split("/")
        const newIds = []
        
        newIds.push(...splitIds(digits[1].split("")))
        newIds.push("month")
        newIds.push(...splitIds(digits[0].split("")))
        newIds.push("day")


        return newIds
    }

    const checkInput = (character: string, input: string) => {
        return (Number.isInteger(parseInt(character)) || (character == "/" && countBy(input)["/"] == 1)) && input.length <= 5
    }

    const validateInput = (input: string) => {
        const validation = ref(false)
        const errorMessage = ref<String|null>(null)

        validation.value = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/gm.test(input)
        if (!validation.value) {
            errorMessage.value = "the input must be a valid date in the format of dd/mm"
        }

        const daymonth = input.split("/")
        validation.value = dayjs(`${2020}-${daymonth[1]}-${daymonth[0]}`, "YYYY-MM-DD", true).isValid()
        if (!validation.value) {
            errorMessage.value = `${daymonth[0]}/${daymonth[1]} is not a valid date`
        }

        return {validation, errorMessage}
    }

    return {generateDateIds: generateIds, checkDate: checkInput, validateDate: validateInput, generateRandomDate: generateRandom}

}