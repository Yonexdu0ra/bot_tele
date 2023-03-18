module.exports = async function (page, options = {}) {
    try {
        await page.waitForSelector(options.input)
        await page.click(options.input)
        const inputElement = await page.$(options.input)
        await inputElement.type(options.url)
        await page.click(options.button)
        await page.waitForSelector(options.selector_download, { timeout: 120000 })
        let fileName = await page.evaluate(selector => {
            let element = document.querySelector(selector)
            element.click()
            return element.getAttribute('_name') ? element.getAttribute('_name') : ''
        }, options.selector_download)
        // await page.goto('chrome://downloads/')
        return fileName
    } catch (error) {
        console.log(error);
    }
}