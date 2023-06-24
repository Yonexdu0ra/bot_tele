import checkLoginTiktok from "./checkLoginTiktok.js"
import permissionSchema from "../models/permission.js"
import typeContentTiktok from "./typeContentTiktok.js"
import closeModal from "./closeModal.js"
import optionPostingChedulem from "../config/setTimeUploadVideo.js"
import postingChedule from "./postingChedule.js"
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
        await iframe.waitForSelector("input", { hidden: true })
        const inputElement = await iframe.$(options.input)
        await inputElement.evaluate((input) => {
            input.style.display = "block"
        })
        const listPermission = await permissionSchema.findOne()
        await inputElement.uploadFile(options.path_video)

        await iframe.waitForSelector(options.preview, { timeout: (60 * (10 ** 4)) })
        await iframe.waitForSelector(options.span, { timeout: (60 * (10 ** 4)) })
        await typeContentTiktok({ page, iframe, options })
        const [isModalSaveVideo, isModalSplitVideo] = await Promise.all([
            closeModal(iframe, options.button_close_modal),
            closeModal(iframe, options.button_close_split_video)
        ])


        await iframe.evaluate(({ isComment, isDuet, isStitch }) => {
            const [boxComment, boxDuet, boxStitch] = [...document.querySelectorAll("label")]
            !isComment ? boxComment.click() : null
            !isDuet ? boxDuet.click() : null
            !isStitch ? boxStitch.click() : null
            return
        }, listPermission)
        if (listPermission.isSetTime) {
            optionPostingChedulem.date = listPermission.time_upload
            await postingChedule(iframe, optionPostingChedulem)
        }
        if (isModalSaveVideo || isModalSplitVideo) {
            await typeContentTiktok({ page, iframe, options })
        }
        await iframe.waitForSelector(options.button_upload)
        await iframe.click(options.button_upload)
        return true
    } catch (error) {
        console.log(`error upload:: `, error)
        return false
    }
}

