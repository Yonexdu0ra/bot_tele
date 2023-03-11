module.exports = async function (page, options) {
    const a = {
        creator: 'creator#',
        input: 'input[type=file]',
        // path_video: `${downloadPath}${fileName}`,
        preview: 'div.jsx-1056830397.preview',
        span: 'span[data-text="true"]',
        button_upload: "button.css-y1m958",
        modal: 'div.tiktok-modal__modal-title',
        // firstContent,
        // lastContent
    }
    try {
        await page.waitForSelector('iframe')
        const iframe = await page.frames().find(f => {
            return f.url().includes(options.creator)
        })
        await page.evaluate(() => {
            console.log(document.querySelector('iframe'))
            const input = document.querySelector('iframe').contentWindow.document.querySelector('input')
            input.style.display = 'block'
        })
        const inputElement = await iframe.$(options.input)
        await inputElement.uploadFile(options.path_video)

        await iframe.waitForSelector(options.preview, { timeout: `${60 * 5000}` })

        await iframe.waitForSelector(options.span)
        await iframe.evaluate((selector, content) => document.querySelector(selector).textContent = content, options.span, options.firstContent)
        await iframe.click(options.span)
        await iframe.type(options.span, options.lastContent)

        await iframe.evaluate(() => {
            const [isComment, isDuet, isStitch] = [...document.querySelectorAll('label')]
            isStitch.click()
            isDuet.click()
            isComment.click()
            return
        })
        const btnSubmit = await iframe.$(options.button_upload)
        btnSubmit.click()
        await iframe.waitForSelector(options.modal, { timeout: 120000 })
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}