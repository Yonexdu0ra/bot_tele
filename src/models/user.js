import { Schema, model } from "mongoose"

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

export default model("User", userSchema)