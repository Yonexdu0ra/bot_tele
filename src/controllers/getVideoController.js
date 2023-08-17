import { launch } from "puppeteer-core"
import configBrowser from "../config/browser.js"
import getDataDownload from "../utils/getDataDownload.js"
import optionsGetDataVideo from "../config/getDataVideo.js"
import getTokenDownloadVideo from "../utils/getTokenDownloadVideo.js"
import { config } from "dotenv"
config()
export default async function (msg, match) {
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
        await this.sendMessage(chat_id, `Vui lòng nhập theo cú pháp: ${isCommand} <b>URL Video</b>`, { reply_to_message_id: message_id, parse_mode: "HTML" })
        return
    }
    const urlPattern = /(https?:\/\/[^\s]+)/

    const dataUrl = isValue.match(urlPattern)
    const url = dataUrl ? dataUrl[1] : ''
    if (!url) {
        await this.sendMessage(chat_id, `URL Video hợp lệ vui lòng thử lại`, { reply_to_message_id: message_id })
        return
    }
    await this.sendMessage(chat_id, "Vui lòng đợi trong ít phút...")
    const browser = await launch(configBrowser)
    try {
        const page = await browser.newPage()
        const options = optionsGetDataVideo(url)
        console.log(options)
        const token = await getTokenDownloadVideo(page, options)
        if (!token) {
            // console.log(token)
            await this.sendMessage(chat_id, `Lỗi rồi ông cháu ơi! OGC`, { reply_to_message_id: message_id })
            await browser.close()
            return
        }
        const infoVideo = await getDataDownload(token, options)
        if (infoVideo.error) {
            await this.sendMessage(chat_id, infoVideo.error)
            await browser.close()
            return
        }
        const video = infoVideo.medias.find(video => video.quality == "hd" || video.quality == "sd" || video.quality)
        const data = {
            url: infoVideo.url,
            thumbnail: infoVideo.thumbnail,
            title: infoVideo.title,
            duration: infoVideo.duration,
            source: infoVideo.source,
            quality: video.quality,
            formattedSize: video.formattedSize,
            temporary_url: video.url
        }
        await browser.close()
        await this.sendMessage(chat_id, `Title: <code>${data.title.replace(/<\/?[^>]+(>|$)/g, '(ký tự đặc biệt)')}</code>\nQuality: <b>${data.quality?.toLocaleUpperCase()}</b>\nDuration: <b>${data.duration}</b>\nSize: <b>${data.formattedSize}</b>\nSource: <b>${data.source}</b>`, { reply_to_message_id: message_id, parse_mode: "HTML" })
        const MAX_SIZE_VIDEO = 20
        if(data.formattedSize.includes("MB") && +data.formattedSize.split("MB")[0] >= MAX_SIZE_VIDEO) {
            await this.sendMessage(chat_id, `<b>File quá nặng (<b>~${data.formattedSize}</b>) nên nếu muốn xem hoặc tải video thì vui lòng truy cập đường đẫn này:</b> ${data.temporary_url}`, { parse_mode: "HTML"})
            return
        }
        await this.sendVideo(chat_id, data.temporary_url, {
            caption: data.title,
            duration: data.duration
        }, { contentType: 'video/mp4' })
    } catch (error) {
        // await browser.close()
        console.log(error);
        this.sendMessage(chat_id, JSON.stringify(error))
     }
}



