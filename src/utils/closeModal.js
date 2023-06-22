export default async function(iframe, selector) {
    return await iframe.evaluate((selectorModal) => {
        return new Promise((resolve) => {
            const modal = document.querySelector(selectorModal)
            if (modal !== null) {
                modal.click()
                setTimeout(resolve(true), 1000)
            }
            resolve(false)
        })
    }, selector)
}