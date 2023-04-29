import checkLoginTiktok from "./checkLoginTiktok.js"
import permissionSchema from "../models/permission.js"
export default async function (page, options) {
    try {
        await page.goto(process.env.URL_UPLOAD_VIDEO_TIKTOK)
        const isLogin = await checkLoginTiktok(page)
        if (!isLogin) {
            console.warn(`Yêu cầu đăng nhập sẵn Tiktok trên trình duyệt Chorme`)
            return false
        }
        await page.waitForSelector("iframe")
        const iframe = await page.frames().find(f => {
            return f.url().includes(options.creator)
        })
        await page.evaluate(() => {
            const iframe = document.querySelector("iframe").contentDocument
            console.log("page", iframe)
            iframe.addEventListener("DOMContentLoaded", () => {
                const input = iframe.querySelector("input")
                input.style.display = "block"
            })
            return
        })
        const inputElement = await iframe.$(options.input)
        await inputElement.uploadFile(options.path_video)
        await iframe.waitForSelector(options.preview, { timeout: `${60 * 5000}` })
        await iframe.waitForSelector(options.span)
        await iframe.click(options.form)
        await page.keyboard.down("Control")
        await page.keyboard.press("KeyA")
        await page.keyboard.up("Control")
        await iframe.type(options.form, options.content)
        const listPermission = await permissionSchema.findOne()
        await iframe.evaluate((options) => {
            const [isComment, isDuet, isStitch] = [...document.querySelectorAll("label")]
            !options.isComment ? isComment.click() : null
            !options.isDuet ? isDuet.click() : null
            !options.isStitch ? isStitch.click() : null
            return
        }, listPermission)
        await iframe.waitForSelector(options.button_upload)
        await iframe.click(options.button_upload)
        await iframe.waitForSelector(options.modal, { timeout: 120000 })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}