import { Schema, model } from "mongoose"
const CommandSchema = new Schema({
    title: String,
    body: String
}, {
    timestamps: true,
    versionKey: false
})

export default model("Command", CommandSchema)