import { ref } from "vue"

export const changeType = ref("")
export const isChangeModalActive = ref(false)

export function change(type: string) {
    if (type == "name") {
        changeType.value = "name"
    } else if (type == "email") {
        changeType.value = "email"
    } else if (type == "password") {
        changeType.value = "password"
    }
    isChangeModalActive.value = true
}