import { useSound } from "@vueuse/sound"

// play id's in sequence
export function usePlaySequence({sfx, spriteMap}) {

    const isLoaded = ref(false)
    const currIdPos = ref(-1)
    const idList = ref([])
    const nextIdList = ref([])

    const { play, stop } = useSound(sfx, {
        sprite: spriteMap,
        interrupt: false,
        onload: () => {
            isLoaded.value = true
        },
        onstop: () => {
            if (nextIdList.value.length > 0) {
                currIdPos.value = 0
                idList.value = nextIdList.value
                nextIdList.value = []
                play({id: idList.value[currIdPos.value]})
            } else {
                currIdPos.value = -1
                idList.value = []
            }
        },
        onend: () => {
            currIdPos.value += 1
            if (currIdPos.value < idList.value.length) {
                play({id: idList.value[currIdPos.value]})
            } else {
                currIdPos.value = -1
                idList.value = []
            }
        },
    })

    const playSequence = (ids) => {
        if (!isLoaded.value) return
        if (idList.value.length > 0) {
            stop()
            nextIdList.value = ids
        } else {
            idList.value = ids
            currIdPos.value = 0
            play({id: idList.value[currIdPos.value]})
        }
    }
    

    return {stopSequence: stop, playSequence}

}