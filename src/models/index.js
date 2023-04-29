import mongoose from "mongoose"
export default  async function (uri, opitons) {
    try {
        await mongoose.connect(uri, opitons)
        console.log(`connection db success`)
    }
    catch (err) {
        console.log(`connection db error: ${err}`)
    }
}