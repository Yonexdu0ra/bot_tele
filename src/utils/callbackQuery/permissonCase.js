import permissionSchema from "../../models/permission.js"
import permissionKeyboard from "./keyboardPermission.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const [key, value] = data.value.split(": ")
        let isData = await permissionSchema.findOne()
        isData = isData.toObject()
        isData[key] = !(JSON.parse(value))
        const update = {}
        update[key] = isData[key]
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