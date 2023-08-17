import ctrlA from "./ctrlA.js"
export default async function ({ page, iframe, options }) {
    try {
        await iframe.click(options.form)
        await ctrlA(page)
        await iframe.type(options.span, options.content + " ") //khi nhập xong content sẽ ấn cách để không hiển thị modal hastag
        return
    } catch (error) {
        console.log(`error typeContent:: `, error)
    }
}