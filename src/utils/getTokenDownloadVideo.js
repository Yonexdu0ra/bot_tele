export default async function (page, { input, snaptik_url }) {
    try {
        await page.goto(snaptik_url)
        await page.waitForSelector(input)
        const token = await page.evaluate((selector_input) => {
            const inputElement = document.querySelector(selector_input)
            return inputElement ? inputElement.value : ""
        }, input)
        return token
    } catch (error) {
        console.log(error)
        return ""
    }
}