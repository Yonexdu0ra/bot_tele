module.exports = function (bot, chat_id) {
    const instruction = [
        `Sử dụng cú pháp /upload <Url video> | <Nội dung của video> để upload video.`,
        `lưu ý: dấu "|" để ngăn cách url video với nội dung video.`,
        `ví dụ: /upload https://v.douyin.com/SvruEPj/ | cute quá 😍 #cute #beauty`
    ]
    for (const text of instruction) {
        bot.sendMessage(chat_id, text)
    }

}
