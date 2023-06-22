import { Schema, model } from "mongoose"
const CommandSchema = new Schema({
    command : String,
    description: String
}, {
    timestamps: true,
    versionKey: false
})  

export default model("Command", CommandSchema)