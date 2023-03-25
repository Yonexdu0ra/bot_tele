require('dotenv').config()
const fs = require('fs')
const puppeteer = require('puppeteer-core')
const userSchema = require('../models/user')
const instruction_message = require('../util/instruction_message')
const get_url_and_content = require('../util/get_url_and_content')
const check_file_and_wait_download = require('../util/check_file_and_wait_download')
const download_video_no_logo = require('../util/download_video_no_logo')
const upload_video = require('../util/upload_video')
const check_file_and_remove = require('../util/check_file_and_remove')
const options = require('../util/options_browser')
const downloadPath = process.env.PATH_DOWNLOAD_FILE
module.exports = async function (msg, match) {
    const time = Date.now()
    const isCommand = match[0]
    const indexCommand = match.index
    const redundantCommand = match.input.split(' ')[0].split(isCommand)[1]
    if (redundantCommand && indexCommand === 0) {
        this.sendMessage(msg.chat.id, `Có phải ý bạn là ${isCommand} ?`)
        return
    }
    if (indexCommand !== 0) {
        return
        // instruction_message(this, msg.chat.id)
    }
    const isValue = match.input.split(isCommand)[1]
    if (!isValue) {
        instruction_message(this, msg.chat.id)
        return
    }
    if (!isValue.includes('|')) {
        this.sendMessage(msg.chat.id, `Thiếu dấu "|" để ngăn cách url video với nội dung cho video`)
        return
    }
    const { url, content } = get_url_and_content(isValue)
    if (!url) {
        this.sendMessage(msg.chat.id, `Vui lòng nhập url video cần upload`)
        return
    }
    if (!content) {
        this.sendMessage(msg.chat.id, `Vui lòng nhập nội dung cho video`)
        return
    }
    let fileName = `Quis_dev.mp4`
    this.sendMessage(msg.chat.id, `Bắt đầu quá trình xoá logo video`, { reply_to_message_id: msg.message_id })
    const browser = await puppeteer.launch(options)
    try {
        const page = await browser.newPage()
        await page.goto(process.env.FPT_URL)
        fileName = await download_video_no_logo(page, {
            url,
            input: 'input#url',
            button: 'button#submit-form',
            selector_download: 'a#tt2-no-watermark-mp4-hd[_name]',
            dir: downloadPath
        })
        const isFile = await check_file_and_wait_download(process.env.PATH_DOWNLOAD_FILE, fileName)
        if (isFile) {
            fileName = isFile
            this.sendMessage(msg.chat.id, `Xóa logo thành công`, { reply_to_message_id: msg.message_id })
        } else {
            await browser.close()
            this.sendMessage(msg.chat.id, `Xóa logo không thành công`, { reply_to_message_id: msg.message_id })
            return
        }
        if (fileName) {
            this.sendMessage(msg.chat.id, `Bắt đầu upload video`, { reply_to_message_id: msg.message_id })
            const isUpload = await upload_video(page, {
                creator: 'creator#',
                input: 'input[type=file]',
                path_video: `${downloadPath}${fileName}`,
                preview: 'div.jsx-1056830397.preview',
                form: `div[data-offset-key].public-DraftStyleDefault-block.public-DraftStyleDefault-ltr`,
                button_upload: "button.css-y1m958",
                span: `span[data-text]`,
                modal: 'div.tiktok-modal__modal-title',
                content
            })
            isUpload ? this.sendMessage(msg.chat.id, `Video đã dược upload ! - ${Math.floor((Date.now() - time) / 1000)}s`, { reply_to_message_id: msg.message_id }) : this.sendMessage(msg.chat.id, `Đã upload video không thành công !`, { reply_to_message_id: msg.message_id })
        } else {
            this.sendMessage(msg.chat.id, `Đã upload video không thành công vui lòng thử lại !`, { reply_to_message_id: msg.message_id })
        }
        await browser.close()
    } catch (error) {
        await browser.close()
        console.log(error)
        this.sendMessage(msg.chat.id, JSON.stringify(error), { reply_to_message_id: msg.message_id })
        check_file_and_remove(`${downloadPath}${fileName}`)
    }
    finally {
        check_file_and_remove(`${downloadPath}${fileName}`)
        await userSchema.create({
            id: msg.from.id,
            first_name: msg.from.first_name,
            last_name: msg.from.last_name,
            username: msg.from.username,
            text: msg.text,
            language_code: msg.from.language_code,
            isCommand: match[0],
            date: msg.date,
            isBot: msg.from.is_bot
        })
    }
}