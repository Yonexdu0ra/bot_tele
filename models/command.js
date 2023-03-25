const { Schema, model } = require('mongoose')
const CommandSchema = new Schema({
    title: String,
    body: String
}, {
    timestamps: true,
    versionKey: false
})

module.exports = model('Command', CommandSchema)