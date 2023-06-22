import dotenv from "dotenv"
import puppeteer from "puppeteer-core"
import optionsBrowser from "../config/browser.js"
import checkFileAndRemove from "../utils/checkFileAndRemove.js"
import checkAndGetFileName from "../utils/checkAndGetFileName.js"
import getDataDownload from "../utils/getDataDownload.js"
import downloadVideo from "../utils/downloadVideo.js"
import getUrlAndContent from "../utils/getUrlAndContent.js"
import optionsGetDataVideo from "../config/getDataVideo.js"
import uploadVideoTiktok from "../utils/uploadVideoTiktok.js"
import optionsUploadVideoTiktok from "../config/uploadVideoTiktok.js"
import userSchema from "../models/user.js"
import getTokenDownloadVideo from "../utils/getTokenDownloadVideo.js"
dotenv.config()

export default async function (msg, match) {
    const downloadPath = process.env.PATH_DOWNLOAD_FILE
    const time = Date.now()
    const chat_id = msg.chat.id, message_id = msg.message_id
    const isCommand = match[0]
    const indexCommand = match.index
    const redundantCommand = match.input.split(' ')[0].split(isCommand)[1]
    if (redundantCommand && indexCommand === 0) {
        await this.sendMessage(chat_id, `Có phải ý bạn là ${isCommand} ?`)
        return
    }
    if (indexCommand !== 0) {
        return
    }
    let isValue = match.input.split(isCommand)[1]
    if (!isValue) {
        this.sendMessage(chat_id,
            `Vui lòng nhập đúng theo cú pháp:/upload <b>URL Video Tiktok hoặc Douyin</b> | <b>Nội dung cho video mà bạn muốn đăng</b>\nTrong đó dấu <code>|</code> để ngăn cách url và nội dung\n\n(Nếu chỉ điền mỗi <b>URL</b> mà không điền  <b>| và nội dung</b> thì Bot sẽ tự động nhập nội dung gốc của video để làm nội dung cho video đó)`,
            {
                reply_to_message_id: message_id,
                parse_mode: "HTML"
            })
        return
    }
    if (!isValue.includes('|')) {
        // thêm dấu | vào input để getUrlAndContent có thể hoạt động mà không bị lỗi
        isValue += " |"
    }
    let { url, content } = getUrlAndContent(isValue)
    if (!url) {
        await this.sendMessage(chat_id, `Vui lòng nhập: <b>URL video cần Tiktok hoặc Douyin</b> cần upload`, {
            reply_to_message_id: message_id,
            parse_mode: "HTML"
        })
        return
    }
    if (url.includes("|")) {
        await this.sendMessage(chat_id, `Vui lòng không viết liền <b>|</b> với <b>URL video</b> khi bạn muốn nhập <b>Nội Dung cho Video</b>`, {
            reply_to_message_id: message_id,
            parse_mode: "HTML"
        })
        return
    }
    let fileName = `Yonexdu0ra_TikTok_Video.mp4`
    await this.sendMessage(chat_id, `Chú đợi tý để anh xử lý`, { reply_to_message_id: message_id })
    const browser = await puppeteer.launch(optionsBrowser)
    try {
        const page = await browser.newPage()
        const options = optionsGetDataVideo(url)
        const token = await getTokenDownloadVideo(page, options)
        if (!token) {
            await this.sendMessage(chat_id, `Lỗi rồi ông cháu ơi! OGC`, { reply_to_message_id: message_id })
            await browser.close()
            return
        }
        const infoVideo = await getDataDownload(token, options)
        if (infoVideo.error) {
            await this.sendMessage(chat_id, JSON.stringify(infoVideo.error));
            await browser.close()
            return
        }
        // qua trang upload video luôn để tải xong video thì upload luôn
        await page.goto(process.env.URL_UPLOAD_VIDEO_TIKTOK)
        const data = await downloadVideo(infoVideo, downloadPath)

        const isFile = await checkAndGetFileName(downloadPath, data.fileName)
        if (isFile) {
            fileName = isFile
            // await this.sendMessage(chat_id, `Xử lý video thành công!\nTitle: <b>${content ? content : data.title}</b>\nQuality: <b>${data.quality?.toLocaleUpperCase()}</b>\nDuration: <b>${data.duration}</b>\nSource: <b>${data.source}</b>`, { reply_to_message_id: message_id, parse_mode: "HTML" })
            await this.sendMessage(chat_id, `Title: <code>${(content ? content : data.title.replace(/<\/?[^>]+(>|$)/g, '(ký tự đặc biệt)'))}</code>\nQuality: <b>${data.quality?.toLocaleUpperCase()}</b>\nDuration: <b>${data.duration}</b>\nSize: <b>${data.formattedSize}</b>\nSource: <b>${data.source}</b>`, { reply_to_message_id: message_id, parse_mode: "HTML" })
        } else {
            await browser.close()
            await this.sendMessage(chat_id, `Xử lí video thất bại chú em vui lòng thử lại !`, { reply_to_message_id: message_id })
            return
        }
        content = content ? content : data.title ? data.title : `Quis_73_crawler_video_${Math.floor(Math.random() * 100)}`
        if (fileName) {
            await this.sendMessage(chat_id, `Đợi tý để anh upload video`, { reply_to_message_id: message_id })
            const isUpload = await uploadVideoTiktok(page, optionsUploadVideoTiktok(`${downloadPath}${fileName}`, content))
            // isUpload ? await this.sendMessage(chat_id, `Video đã dược upload ! - ${Math.floor((Date.now() - time) / 1000)}s`, { reply_to_message_id: message_id }) : await this.sendMessage(chat_id, `Đã upload video không thành công !`, { reply_to_message_id: message_id })
            if (isUpload) {
                await this.sendMessage(chat_id, `Ok video upload thành công rồi đấy chú em ! - ${Math.floor((Date.now() - time) / 1000)}s`, { reply_to_message_id: message_id })
                await userSchema.create({
                    id: msg.from.id,
                    first_name: msg.from.first_name ? msg.from.first_name : '',
                    last_name: msg.from.last_name ? msg.from.last_name : '',
                    username: msg.from.username,
                    text: content,
                    language_code: msg.from.language_code,
                    isCommand: match[0],
                    date: msg.date,
                    isBot: msg.from.is_bot
                })
            } else {
                await this.sendMessage(chat_id, `Lỗi rồi anh không  upload video được thử lại đi !`, { reply_to_message_id: message_id })
            }
        } else {
            await this.sendMessage(chat_id, `upload tạch rồi vui lòng thử lại !`, { reply_to_message_id: message_id })
        }
        await browser.close()
        return
    } catch (error) {
        await browser.close()
        console.log(error)
        await this.sendMessage(chat_id, JSON.stringify(error), { reply_to_message_id: message_id })
        // checkFileAndRemove(`${downloadPath}${fileName}`)
    }
    finally {
        checkFileAndRemove(`${downloadPath}${fileName}`)
    }
}

