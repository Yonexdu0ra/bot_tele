import permission from "../../models/permission.js"
export default async function (bot, { chat_id, message_id }) {
    try {
        await permission.findOneAndUpdate({}, {
            isSetTime: false,
            time_upload: 0
        })
        await bot.deleteMessage(chat_id, message_id)
        await bot.sendMessage(chat_id, "Đã hủy thành công hẹn giờ upload video")
    } catch (error) {
        console.log(error)
    }
}