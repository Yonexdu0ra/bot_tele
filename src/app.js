import telegramBot from "node-telegram-bot-api"
import database from "./models/index.js"
import uploadVideoNoWatermark from "./controllers/uploadVideoTiktokController.js"
import getPermission from "./controllers/getPermissionController.js"
import callbackQueryController from "./controllers/callbackQueryController.js"
import historyController from "./controllers/historyController.js"
export default async function (config) {
    try {
        const commands = [
            { command: '/ls', description: 'Xem lịch sử upload video' },
            { command: '/permission', description: 'Set quyền (comment, duet, slick) khi upload video tiktok' },
            { command: '/upload', description: 'Upload video lên tiktok' }
        ];
        await database(config.uri_db, config.options_đb)
        const bot = new telegramBot(config.telegram_api_token, { polling: true })
        await bot.setMyCommands(commands);
        bot.on('callback_query', callbackQueryController.bind(bot))
        bot.onText(/\/ls/, historyController.bind(bot))
        bot.onText(/\/upload/, uploadVideoNoWatermark.bind(bot))
        bot.onText(/\/permission/, getPermission.bind(bot))
    } catch (error) {
        console.error(error)
    }
}