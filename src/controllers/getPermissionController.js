import userPermission from "../models/permission.js"
import permissionKeyboard from "../utils/callbackQuery/keyboardPermission.js"
export default async function (msg, match) {
    const isCommand = match[0]
    const indexCommand = match.index
    const redundantCommand = match.input.split(" ")[0].split(isCommand)[1]
    if (redundantCommand && indexCommand === 0) {
        await this.sendMessage(msg.chat.id, `Có phải ý bạn là ${isCommand} ?`)
        return
    }
    if (indexCommand !== 0) {
        return
    }   
    try {
        let data = await userPermission.findOne()
        data = data.toObject()
        const inline_keyboard = permissionKeyboard(data)
        await this.sendMessage(msg.chat.id, `Các thay đổi sẽ được sử dụng với lần đăng video tiếp theo`, {
            reply_markup: { inline_keyboard }
        })
        return
    } catch (error) {
        console.error(error)
        await this.sendMessage(msg.chat.id, JSON.stringify(error))
        return error
    }
}