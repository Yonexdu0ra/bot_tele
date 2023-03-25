const axios = require('axios')
const fs = require('fs')
module.exports = async function (page, options = {}) {
    try {
        await page.waitForSelector(options.input)
        await page.click(options.input)
        const inputElement = await page.$(options.input)
        await inputElement.type(options.url)
        await page.click(options.button)
        await page.waitForSelector(options.selector_download, { timeout: 120000 })
        let [url, fileName] = await page.evaluate(selector => {
            let element = document.querySelector(selector)
            // element.click()
            return element.getAttribute('_name') ? [element.getAttribute('_url'), element.getAttribute('_name')] : []
        }, options.selector_download)
        // await page.goto('chrome://downloads/')
        const writer = fs.createWriteStream(`${options.dir}${fileName}`)
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        response.data.pipe(writer)
        return new Promise((resolve, reject) => {
            writer.on('finish', () => { resolve(fileName) });
            writer.on('error', reject)
        })
    } catch (error) {
        console.log(error);
    }
}

 // try {
    //     await page.waitForSelector(options.input)
    //     await page.click(options.input)
    //     const inputElement = await page.$(options.input)
    //     await inputElement.type(options.url)
    //     await page.click(options.button)
    //     await page.waitForSelector(options.selector_download, { timeout: 120000 })
    //     let fileName = await page.evaluate(selector => {
    //         let element = document.querySelector(selector)
    //         element.click()
    //         return element.getAttribute('_name') ? element.getAttribute('_name') : ''
    //     }, options.selector_download)
    //     // await page.goto('chrome://downloads/')
    //     return fileName
    // } catch (error) {
    //     console.log(error);
    // }