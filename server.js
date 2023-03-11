require('dotenv').config()
const fs = require('fs');
const download_video_no_logo = require('./util/download_video_no_logo')
const check_file_and_wait_download = require('./util/check_file_and_wait_download')
const get_url_and_content = require('./util/get_url_and_content')
const upload_video = require('./util/upload_video')
const telegramBot = require('node-telegram-bot-api')
const downloadPath = process.env.PATH_DOWNLOAD_FILE
const puppeteer = require('puppeteer-core')
const bot = new telegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

bot.onText(/\/start/, (msg, data) => {
    if (data.input.split(' ')[0].split(data[0])[1]) {
        bot.sendMessage(msg.chat.id, `Có Phải ý bạn là /start ?`, { reply_to_message_id: msg.message_id })
        return
    }
    bot.sendMessage(msg.chat.id, `Đây là các lệnh với Bot
    Gõ /upload [(URL video muốn đăng) (|) (Nội dung cho video)]`)
})
function noti(bot, chat_id) {
    bot.sendMessage(chat_id, `Vui lòng nhập nội dung cho video theo cú pháp:
     [url_video_tiktok]|[Nội dung video]`)
    bot.sendMessage(chat_id, `[url_video] - là url video mà bạn đã sao chép (Ví dụ: https://www.tiktok.com/@quis_dev/video/7207255334702861570)`)
    bot.sendMessage(chat_id, `dấu "|" đằng sau để ngăn cách url video với nội dung muốn đăng`)
    bot.sendMessage(chat_id, `[Nội dung video] - là nội dung muốn đăng của video (ví dụ: Child ghê luôn á #relax #child)`)
    bot.sendMessage(chat_id, `Ví dụ hoàn chỉnh - https://www.tiktok.com/@quis_dev/video/7207255334702861570|Child ghê luôn á #relax #child`)
}

bot.onText(/\/upload/, async (msg, data) => {
    if (data.input.split(data[0])[1] && !data.input.split(' ')[1]) {
        bot.sendMessage(msg.chat.id, `Có phải ý bạn là /upload ?`)
        return
    }
    if (data.index !== 0) {
        noti(bot, msg.chat.id)
    }
    const isValue = data.input.split(data[0])[1]
    if (!isValue || !isValue.includes('|')) {
        noti(bot, msg.chat.id)
        return
    }
    const [url, content] = await get_url_and_content(isValue)
    const [firstContent, ...lastContent] = content
    if (!url && !content.length >= 2) {
        noti(bot, msg.chat.id)
    }
    let fileName = ``
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: process.env.PATH_CHROME,
        userDataDir: process.env.PATH_DATA_CHROME,
        ignoreHTTPSErrors: true,
        defaultViewport: null
    })
    try {
        const page = await browser.newPage()
        await page.goto(process.env.FPT_URL)
        const quality = await download_video_no_logo(page, {
            url,
            input: 'input#url.form-control',
            button: 'button.btn.btn-warning',
            table_download: 'div.col-md-7.col-sm-12.mt-4.d-flex.flex-column',
            url_download: 'https://fpttelecom.com/wp-content/plugins/aio-video-downloader/download.php'
        })
        const heavyFile = Number(quality.match(/\d+(\.\d+)?/)) > 20 ? 'big' : 'small'
        if (heavyFile === 'big') {
            console.log(heavyFile)
        }
        await page.goto('chrome://downloads/')
        fileName = await check_file_and_wait_download(`${downloadPath}${fileName}`, `-fpttelecom.mp4`)
        if (fileName) {
            await page.goto(process.env.URL_UPLOAD_VIDEO_TIKTOK)
            const isUpload = await upload_video(page, {
                creator: 'creator#',
                input: 'input[type=file]',
                path_video: `${downloadPath}${fileName}`,
                preview: 'div.jsx-1056830397.preview',
                span: 'span[data-text="true"]',
                button_upload: "button.css-y1m958",
                modal: 'div.tiktok-modal__modal-title',
                firstContent,
                lastContent
            })
            isUpload ? bot.sendMessage(msg.chat.id, `Đã upload video !`, { reply_to_message_id: msg.message_id }) : bot.sendMessage(msg.chat.id, `Đã upload video không thành công !`, { reply_to_message_id: msg.message_id })
        } else {
            bot.sendMessage(msg.chat.id, `Đã upload video không thành công !`, { reply_to_message_id: msg.message_id })
        }
        await browser.close()
    } catch (error) {
        await browser.close()
        console.log(error)
        bot.sendMessage(msg.chat.id, JSON.stringify(error), { reply_to_message_id: msg.message_id })
        if (`${downloadPath}${fileName}`) {
            fs.unlink(`${downloadPath}${fileName}`, (err) => {
                if (err) throw err;
                // console.log('File đã bị xóa!');
            })
        }
    }
    finally {
        if (`${downloadPath}${fileName}`) {
            fs.unlink(`${downloadPath}${fileName}`, (err) => {
                if (err) throw err;
                // console.log('File đã bị xóa!');
            })
        }
    }
})

