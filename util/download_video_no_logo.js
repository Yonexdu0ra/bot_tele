module.exports = async function (page, options = {}) {
    const a = {
        input: 'input#url.form-control',
        button: 'button.btn.btn-warning',
        table_download: 'div.col-md-7.col-sm-12.mt-4.d-flex.flex-column',
        url_download: 'https://fpttelecom.com/wp-content/plugins/aio-video-downloader/download.php'
    }
    try {
        await page.waitForSelector(options.input)
        await page.click(options.input)
        const inputElement = await page.$(options.input)
        await inputElement.type(options.url)
        await page.click(options.button)
        await page.waitForSelector(options.table_download, { timeout: 120000 })
        const quality = await page.evaluate((selector) => {
            const quality = document.querySelector(selector)
            quality.target = ''
            quality.click()
            return quality.textContent
        }, `${options.table_download} > a`)
        await page.waitForResponse((res) => {
            return res.url().includes(options.url_download)
        })
        await page.goto('chrome://downloads/')
        return quality
    } catch (error) {
        console.log(error);
    }
}