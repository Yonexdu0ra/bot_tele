import { Schema, model } from "mongoose"
const options = {
    type: Boolean,
    default: false
}
const permissionSchema = new Schema({
    isDuet: options,
    isComment: options,
    isStitch: options,
    isSetTime: options,
    time_upload: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
})


export default model("Permission", permissionSchema)