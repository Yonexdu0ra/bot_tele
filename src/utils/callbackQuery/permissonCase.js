import permissionSchema from "../../models/permission.js"
import permissionKeyboard from "./keyboardPermission.js"
import permissionSetTime from "./getTimeCase.js"
import getDateUpload from "../getDateUpload.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const [key, value] = data.value.split(": ") 
        if(key === "isSetTime") {
            const date = new Date()
            const listDate = getDateUpload(date.getDate(), date.getMonth())
            const inline_keyboard = permissionSetTime(listDate)
            await bot.editMessageReplyMarkup({ inline_keyboard }, { chat_id, message_id })
            return
        }
        let permission = await permissionSchema.findOne()
        permission = permission.toObject()
        permission[key] = !(JSON.parse(value))
        const update = {}
        update[key] = permission[key]
        let newData = await permissionSchema.findOneAndUpdate({}, update, { new: true })
        newData = newData.toObject()
        const inline_keyboard = permissionKeyboard(newData)
        await bot.editMessageReplyMarkup({ inline_keyboard }, { chat_id, message_id })
    } catch (error) {
        console.log(error)
        await bot.sendMessage(chat_id, "Chú em bấm từ từ thôi")
        return error
    }
}