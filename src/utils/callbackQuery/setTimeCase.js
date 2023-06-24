import permission from "../../models/permission.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        await permission.findOneAndUpdate({}, {
            isSetTime: true,
            time_upload: data.value
        }, {
            new: true
        })
        await bot.deleteMessage(chat_id, message_id)
        await bot.sendMessage(chat_id, `Video bạn tiếp theo mà bạn upload sẽ được upload vào Ngày ${data.value}`)
    }
    catch (error) {
        console.log(error)
        await bot.sendMessage(chat_id, JSON.stringify(error))
    }
}