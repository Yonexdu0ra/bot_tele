import userSchema from "../../models/user.js"
// import getUrlAndContent from "../getUrlAndContent.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const listData = await userSchema.find({ id: data.data }).exec()
        let text = ``
        for (const data of listData) {
            const isTime = new Date(data.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
            text += `Lúc: <b>${isTime}</b> <code>${data.username}</code> đã upload một video với nội dung là: <code>${data.text.replace(/<\/?[^>]+(>|$)/g, '(ký tự đặc biệt đã bị ẩn)')}</code>\n\n`
        }
        if (text.length <= 4096) {
            await bot.sendMessage(chat_id, text, {
                parse_mode: "HTML"
            })
        } else {
            let chunks = [];
            let i = 0;
            while (i < text.length) {
                chunks.push(text.substring(i, i + 4096));
                i += 4096;
            }
            chunks.forEach(async (chunk) => {
                await bot.sendMessage(chat_id, chunk, { parse_mode: "HTML" });
            });
        }

    } catch (error) {
        console.log(error)
        await bot.sendMessage(chat_id, JSON.stringify(error))
        return error
    }
}