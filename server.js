require('dotenv').config()
const fs = require('fs')
const download_video_no_logo = require('./util/download_video_no_logo')
const check_file_and_wait_download = require('./util/check_file_and_wait_download')
const get_url_and_content = require('./util/get_url_and_content')
const upload_video = require('./util/upload_video')
const instruction_message = require('./util/instruction_message')
const telegramBot = require('node-telegram-bot-api')
const downloadPath = process.env.PATH_DOWNLOAD_FILE
const puppeteer = require('puppeteer-core')
const bot = new telegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

bot.onText(/\/ls/, (msg, data) => {
    if (data.input.split(data[0])[1] && !data.input.split(' ')[1]) {
        bot.sendMessage(msg.chat.id, `Có phải ý bạn là /ls ?`)
        return
    }
    if (data.index !== 0) {
        return
    }
    fs.readdir(process.env.PATH_DOWNLOAD_FILE, (err, data) => {
        if (err) {
            bot.sendMessage(msg.chat.id, JSON.stringify(err))
            return
        }
        const isFile = data.filter(file => file.includes('fpttelecom') && file.includes('.mp4'))
        if (isFile.length === 0) {
            bot.sendMessage(msg.chat.id, `no files found`)
        } else {
            isFile.forEach(file => bot.sendMessage(msg.chat.id, JSON.stringify(file)))
        }
    })
})

bot.onText(/\/clearFile/, (msg, data) => {
    if (data.input.split(data[0])[1] && !data.input.split(' ')[1]) {
        // bot.sendMessage(msg.chat.id, `Có phải ý bạn là /upload ?`)
        return
    }
    if (data.index !== 0) {
        return
    }
    fs.readdir(process.env.PATH_DOWNLOAD_FILE, (err, data) => {
        if (err) {
            bot.sendMessage(msg.chat.id, JSON.stringify(err))
            return
        }
        const isFileTrash = data.filter(file => file.includes('fpttelecom') && file.includes('.mp4'))
        if (isFileTrash.length === 0) {
            bot.sendMessage(msg.chat.id, `no more files to delete`)
            return
        } else {
            const inline_keyboard = []
            isFileTrash.forEach(file => {
                console.log(file)
                inline_keyboard.push([{ text: file, callback_data: file }])
            })
            bot.sendMessage(msg.chat.id, `Bạn muốn xóa file nào ?`, {
                reply_markup: {
                    inline_keyboard
                }
            })
        }
    })
})
bot.on('callback_query', (query) => {
    const fileName = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    fs.unlink(`${process.env.PATH_DOWNLOAD_FILE}${fileName}`, (err) => {
        err ? bot.editMessageText(`Xóa file ${fileName} không thành công đã có lỗi xảy ra`, {
            chat_id: chatId,
            message_id: messageId
        }) : bot.editMessageText(`Đã xóa file ${fileName}`, {
            chat_id: chatId,
            message_id: messageId
        })
    })
});
bot.onText(/\/start/, (msg, data) => {
    if (data.input.split(' ')[0].split(data[0])[1]) {
        bot.sendMessage(msg.chat.id, `Có Phải ý bạn là /start ?`, { reply_to_message_id: msg.message_id })
        return
    }

    bot.sendMessage(msg.chat.id, `Đây là các lệnh với Bot: Nhập /upload - upload video lên tiktok`)
})


bot.onText(/\/upload/, async (msg, data) => {
    if (data.input.split(data[0])[1] && !data.input.split(' ')[1]) {
        bot.sendMessage(msg.chat.id, `Có phải ý bạn là /upload ?`)
        return
    }
    if (data.index !== 0) {
        return
        // instruction_message(bot, msg.chat.id)
    }
    const isValue = data.input.split(data[0])[1]
    if (!isValue || !isValue.includes('|')) {
        instruction_message(bot, msg.chat.id)
        return
    }
    const [url, content] = await get_url_and_content(isValue)
    if (!url && !content.length >= 2) {
        instruction_message(bot, msg.chat.id)
    }
    let fileName = `Quis_dev.mp4`
    bot.sendMessage(msg.chat.id, `Bắt đầu quá trình xoá logo video`, { reply_to_message_id: msg.message_id })
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PATH_CHROME,
        userDataDir: process.env.PATH_DATA_CHROME,
        ignoreHTTPSErrors: true,
        defaultViewport: null
    })
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
        if(isFile) {
            fileName = isFile
            bot.sendMessage(msg.chat.id, `Xóa logo thành công`, { reply_to_message_id: msg.message_id })
        } else {
            await browser.close()
            bot.sendMessage(msg.chat.id, `Xóa logo không thành công`, { reply_to_message_id: msg.message_id })
            return
        }
        if (fileName) {
            bot.sendMessage(msg.chat.id, `Bắt đầu upload video`, { reply_to_message_id: msg.message_id })
            await page.goto(process.env.URL_UPLOAD_VIDEO_TIKTOK)
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
            isUpload ? bot.sendMessage(msg.chat.id, `Đã upload video !`, { reply_to_message_id: msg.message_id }) : bot.sendMessage(msg.chat.id, `Đã upload video không thành công !`, { reply_to_message_id: msg.message_id })
        } else {
            bot.sendMessage(msg.chat.id, `Đã upload video không thành công vui lòng thử lại !`, { reply_to_message_id: msg.message_id })
        }
        await browser.close()
    } catch (error) {
        await browser.close()
        console.log(error)
        bot.sendMessage(msg.chat.id, JSON.stringify(error), { reply_to_message_id: msg.message_id })
        if (fs.existsSync(`${downloadPath}${fileName}`)) {
            fs.unlink(`${downloadPath}${fileName}`, (err) => {
                if (err) throw err;
                // console.log('File đã bị xóa!');
            })
        }
    }
    finally {
        if (fs.existsSync(`${downloadPath}${fileName}`)) {
            fs.unlink(`${downloadPath}${fileName}`, (err) => {
                if (err) throw err;
                // console.log('File đã bị xóa!');
            })
        }
    }
})

