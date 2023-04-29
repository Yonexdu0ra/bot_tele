import { Schema, model } from "mongoose"

const permissionSchema = new Schema({
    isDuet: Boolean,
    isComment: Boolean ,
    isStitch: Boolean 
}, {
    timestamps: true, 
    versionKey: false
})


export default model("Permission", permissionSchema)