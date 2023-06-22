import userSchema from "../../models/user.js"
// import getUrlAndContent from "../getUrlAndContent.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const listData = await userSchema.find({ id: data.data }).exec()
        await bot.sendMessage(chat_id,
            // lấy ra username cuối cùng nhất vì username có thể bị thay đổi
            `User: <code>${listData.at(0).id}</code> (<code>${listData.at(-1).username}</code>) đã upload <b>${listData.length}</b> video`,
            { parse_mode: "HTML" })
        let text = ``
        const MAX_LENGTH = 4096
        for (const data of listData) {
            const isTime = new Date(data.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
            text += `Lúc <b>${isTime}</b> Đã đăng một video với nội dung là: <code>${data.text.replace(/<\/?[^>]+(>|$)/g, '(*)')}</code>\n\n`
            if(text.length >= 2**30) {
                await bot.sendMessage(chat_id, "Ông cháu này đăng nhiều quá không liệt kê được")
                return
            }
        }
        const listMessage = splitMessage(text, MAX_LENGTH)

        for (const content of listMessage) {
            await bot.sendMessage(chat_id, content, {
                parse_mode: "HTML",
                disable_web_page_preview: true
            })
        }
    } catch (error) {
        console.log(error)
        await bot.sendMessage(chat_id, "Lỗi rồi xem cái chóa gì nữa")
        return error
    }
}

function splitMessage(message, maxLength) {
    const chunks = [];
    let currentChunk = '';

    const lines = message.split('\n\n'); // Tách chuỗi thành các dòng

    for (const line of lines) {
        const newChunk = currentChunk + line + '\n\n'; // Thêm dòng vào currentChunk

        if (newChunk.length > maxLength) {
            chunks.push(currentChunk); // Lưu currentChunk vào danh sách chunks
            currentChunk = line + '\n\n'; // Bắt đầu một currentChunk mới với dòng hiện tại
        } else {
            currentChunk = newChunk; // Gán newChunk cho currentChunk
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk); // Lưu currentChunk cuối cùng (nếu còn)
    }

    return chunks;
}
