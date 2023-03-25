require('dotenv').config()
const fs = require('fs')
module.exports = function (msg, match) {
    if (match.input.split(match[0])[1] && !match.input.split(' ')[1]) {
        return
    }
    if (match.index !== 0) {
        return
    }
    fs.readdir(process.env.PATH_DOWNLOAD_FILE, (err, data) => {
        if (err) {
            this.sendMessage(msg.chat.id, JSON.stringify(err))
            return
        }
        const isFileTrash = data.filter(file => file.includes('fpttelecom') && file.includes('.mp4'))
        if (isFileTrash.length === 0) {
            this.sendMessage(msg.chat.id, `no more files to delete`)
            return
        } else {
            const inline_keyboard = []
            isFileTrash.forEach(file => {
                inline_keyboard.push([{ text: file, callback_data: file }])
            })
            this.sendMessage(msg.chat.id, `Bạn muốn xóa file nào ?`, {
                reply_markup: {
                    inline_keyboard
                }
            })
        }
    })
}