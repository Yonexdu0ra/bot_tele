import ctrlA from "./ctrlA.js"
export default async function ({ page, iframe, options }) {
    try {
        await iframe.click(options.form)
        await ctrlA(page)
        await iframe.type(options.form, options.content + " ") //khi nhập xong content sẽ ấn cách để không hiển thị modal hastag
    } catch (error) {
        console.log(`error typeContent:: `, error)
    }
}