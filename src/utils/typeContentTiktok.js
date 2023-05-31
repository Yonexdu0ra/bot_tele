export default async function ({ page, iframe, options }) {
    try {
        await iframe.click(options.form)
        await ctrlA(page)
        await iframe.type(options.form, options.content + " ")
    } catch (error) {
        console.log(`error typeContent:: `, error)
    }
}