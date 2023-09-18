
export function useDataObjects() {

    const getDataObj = (jsonData) => {
        return {
            spriteMap: jsonData.reduce((obj, item) => {
                obj[item.number] = item.sprite
                return obj
            }, {}),
            jyutping: jsonData.reduce((obj, item) => {
                obj[item.number] = item.jyutping
                return obj
            }, {}),
            yale: jsonData.reduce((obj, item) => {
                obj[item.number] = item.yale
                return obj
            }, {}),
            traditional: jsonData.reduce((obj, item) => {
                obj[item.number] = item.traditional
                return obj
            }, {})
        }
    }

    const generateRomanizedText = (ids: Array<String>, obj: Object) => {
        return {
			traditional: ids.map((element) => {return obj.traditional[element]}).join(" "),
			jyutping: ids.map((element) => {return obj.jyutping[element]}).join(" "),
			yale: ids.map((element) => {return obj.yale[element]}).join(" ")
		}
    }

    return { getDataObj, generateRomanizedText}

}