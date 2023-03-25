
const commandSchema = require('../models/command')
module.exports = async function (msg, match) {
    console.log(msg)
    if (match.input.split(' ')[0].split(match[0])[1]) {
        this.sendMessage(msg.chat.id, `Có Phải ý bạn là /start ?`, { reply_to_message_id: msg.message_id })
        return
    }
    this.sendMessage(msg.chat.id, `Đây là các lệnh với Bot:`)
    const listCommand = await commandSchema.find({}).exec()
    for (const command of listCommand) {
        this.sendMessage(msg.chat.id, `${command.title} - ${command.body}`)
    }
}
