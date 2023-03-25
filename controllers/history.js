const userSchema = require('../models/user')
module.exports = async function (msg, match) {
    if (match.input.split(match[0])[1] && !match.input.split(' ')[1]) {
        this.sendMessage(msg.chat.id, `Có phải ý bạn là ${match[0]} ?`)
        return
    }
    if (match.index !== 0) {
        return
    }
    const data = await userSchema.find({}).exec()
    if(data) {
        for (const history of data) {
            this.sendMessage(msg.chat.id, JSON.stringify(history))
        }    
    } else {
        this.sendMessage(msg.chat.id, `no match found`)
    }
}