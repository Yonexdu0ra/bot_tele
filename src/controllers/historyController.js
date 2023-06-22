import userSchema from "../models/user.js"
export default async function (msg, match) {
    const chat_id = msg.chat.id, message_id = msg.message_id
    const isCommand = match[0]
    const indexCommand = match.index
    const redundantCommand = match.input.split(' ')[0].split(isCommand)[1]
    if (redundantCommand && indexCommand === 0) {
        await this.sendMessage(chat_id, `Có phải ý bạn là ${isCommand} ?`)
        return
    }
    if (indexCommand !== 0) { return }
    try {
        const listID = await userSchema.distinct('id')
        const inline_keyboard = []
        for (const ID of listID) {
            inline_keyboard.push([{
                text: `User: ${ID}`,
                callback_data: JSON.stringify({
                    case: "History",
                    data: ID
                })
            }])
        }
        inline_keyboard.push([{
            text: "Close",
            callback_data: JSON.stringify({
                case: "Close",
                value: "Đã đóng"
            })
        }])
        await this.sendMessage(chat_id, `Bạn muốn xem `, {
            reply_markup: { inline_keyboard }
        })
    } catch (error) {
        console.error(error)
        await this.sendMessage(chat_id, JSON.stringify(error))
    }
}