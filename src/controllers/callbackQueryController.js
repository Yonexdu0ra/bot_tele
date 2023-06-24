import permissionCase from "../utils/callbackQuery/permissonCase.js"
import historyCase from "../utils/callbackQuery/historyCase.js"
import getTimeCase from "../utils/callbackQuery/getTimeCase.js"
import closeSetTimeCase from "../utils/callbackQuery/closeSetTimeCase.js"
import setTimeCase from "../utils/callbackQuery/setTimeCase.js"
export default async function ({ message, data }) {
    const chat_id = message.chat.id, message_id = message.message_id
    try {
        data = JSON.parse(data)
        switch (data.case) {
            case "Permission":
                await permissionCase(this, { data, chat_id, message_id })
                break
            case "Close":
                await this.deleteMessage(chat_id, message_id)
                break
            case "History":
                await historyCase(this, { data, chat_id, message_id })
                break
            case "GetTime":
                await getTimeCase(this, { data, chat_id, message_id })
                break
            case "SetTime":
                await setTimeCase(this, { data, chat_id, message_id })
                break
            case "CloseSetTime":
                closeSetTimeCase(this, { chat_id, message_id })
                break
        }
    } catch (error) {
        console.log(error)
    }
}