import permissionCase from "../utils/callbackQuery/permissonCase.js"
import historyCase from "../utils/callbackQuery/historyCase.js"
export default async function ({ message, data }) {
    const chat_id = message.chat.id, message_id = message.message_id
    try {
        data = JSON.parse(data)
        switch (data.case) {
            case "Permission":
                await permissionCase(this, { data, chat_id, message_id })
                break
            case "Close":
                await this.editMessageText(data.value, { chat_id, message_id })
                break
            case "History":
                await historyCase(this, { data, chat_id, message_id })
                break
        }
    } catch (error) {
        console.log(error)
    }
}