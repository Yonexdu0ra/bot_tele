const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    id: Number,
    first_name: String,
    last_name: String,
    username: String,
    text: String,
    language_code: String,
    isCommand: String,
    date: Number,
    isBot: Boolean
}, {
    timestamps: true, 
    versionKey: false
})

module.exports = model('User', userSchema)