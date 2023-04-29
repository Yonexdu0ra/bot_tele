import userSchema from "../../models/user.js"
import getUrlAndContent from "../getUrlAndContent.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const listAction = await userSchema.find({ id: data.data }).exec()
        for (const action of listAction) {
            const { url, content } = getUrlAndContent(action.text)
            const isTime = new Date(action.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
            await bot.sendMessage(chat_id, `Lúc <b>${isTime}</b> \nVideo: <b>${url}</b>\nNội dung là: <b>${content}</b>`, {
                parse_mode: "HTML"
            })
        }
    } catch (error) {
        console.log(error)
        await bot.sendMessage(chat_id, JSON.stringify(error))
        return error
    }
}