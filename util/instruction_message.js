module.exports = function  (bot, chat_id) {
    bot.sendMessage(chat_id, `Vui lòng nhập nội dung cho video theo cú pháp: /upload [url_video_tiktok]|[Nội dung video]`)
    bot.sendMessage(chat_id, `/upload - là lệnh để thực hiện upload`)
    bot.sendMessage(chat_id, `[url_video] - là url video mà bạn đã sao chép (Ví dụ: https://www.tiktok.com/@quis_dev/video/7207255334702861570)`)
    bot.sendMessage(chat_id, `dấu "|" đằng sau để ngăn cách url video với nội dung muốn đăng`)
    bot.sendMessage(chat_id, `[Nội dung video] - là nội dung muốn đăng của video (ví dụ: Child ghê luôn á #relax #child)`)
    bot.sendMessage(chat_id, `Ví dụ hoàn chỉnh - /upload https://www.tiktok.com/@quis_dev/video/7207255334702861570|Child ghê luôn á #relax #child`)
}