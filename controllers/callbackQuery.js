require('dotenv').config()
const fs = require('fs')
module.exports = function (query) {
    const fileName = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    fs.unlink(`${process.env.PATH_DOWNLOAD_FILE}${fileName}`, (err) => {
        if (err) {
            this.editMessageText(`Xóa file ${fileName} không thành công đã có lỗi xảy ra`, {
                chat_id: chatId,
                message_id: messageId
            })
        } else {
            this.editMessageText(`Đã xóa file ${fileName}`, {
                chat_id: chatId,
                message_id: messageId
            })
        }
    })
}