import checkLoginTiktok from "./checkLoginTiktok.js"
import permissionSchema from "../models/permission.js"
import typeContentTiktok from "./typeContentTiktok.js"
export default async function (page, options) {
    try {
        // await page.goto(process.env.URL_UPLOAD_VIDEO_TIKTOK)
        const isLogin = await checkLoginTiktok(page)
        if (!isLogin) {
            console.warn(`Yêu cầu đăng nhập sẵn Tiktok trên trình duyệt Chorme`)
            return false
        }
        await page.waitForSelector("iframe")
        const iframe = await page.frames().find(f => {
            return f.url().includes(options.creator)
        })
        await iframe.waitForSelector("input")
        const inputElement = await iframe.$(options.input)
        await inputElement.evaluate((input) => {
            input.style.display = "block"
        })
        const listPermission = await permissionSchema.findOne()
        await inputElement.uploadFile(options.path_video)
        // await inputElement.setInputFiles(options.path_video)

        await iframe.waitForSelector(options.preview, { timeout: (60 * (10 ** 4)) })
        await iframe.waitForSelector(options.span, { timeout: (60 * (10 ** 4)) })
        await typeContentTiktok({ page, iframe, options })
        await iframe.evaluate((options) => {
            const [isComment, isDuet, isStitch] = [...document.querySelectorAll("label")]
            !options.isComment ? isComment.click() : null
            !options.isDuet ? isDuet.click() : null
            !options.isStitch ? isStitch.click() : null
            return
        }, listPermission)

        const isModalSaveVideo = await iframe.evaluate((selectorModal) => {
            return new Promise((resolve) => {
                const modal = document.querySelector(selectorModal)
                if (modal) {
                    modal.click()
                    setTimeout(() => resolve(true), 1000)
                }
                resolve(false)
            })
        }, options.button_close_modal)
        if (isModalSaveVideo) {
            // await iframe.click(options.button_close_modal)
            await typeContentTiktok({ page, iframe, options })
        }
        // await iframe.waitForSelector(options.button_close_modal)

        await iframe.waitForSelector(options.button_upload)
        await iframe.click(options.button_upload)
        await iframe.waitForSelector(options.modal, { timeout: 120000 })
        return true
    } catch (error) {
        console.log(`error upload:: `, error)
        return false
    }
}

