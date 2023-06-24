import getDateUpload from "../getDateUpload.js"
export default async function (bot, { data, chat_id, message_id }) {
    try {
        const inline_keyboard = []
        if (data.value) {
            inline_keyboard.push([{
                text: `Có tôi muốn hủy`,
                callback_data: JSON.stringify({
                    case: "CloseSetTime"
                    // value: date,
                })
            }])
            inline_keyboard.push([{
                text: `Close`,
                callback_data: JSON.stringify({
                    case: "Close"
                    // value: date,
                })
            }])
            // await bot.deleteMessage(chat_id, message_id)
            // await bot.editMessageReplyMarkup({ inline_keyboard }, { chat_id, message_id })
            await bot.editMessageText("Bạn có muốn hủy hẹn giờ upload video không ?", {
                chat_id,
                message_id,
                reply_markup: { inline_keyboard }
            })
            return
        }
        const date = new Date()
        const listData = getDateUpload(date.getDate(), date.getMonth() + 1) // date.getMonth() phải + 1 để lấy được tháng hiện tại
        //permissionSetTime(listDate)
        for (const data of listData) {
            inline_keyboard.push([{
                text: `Ngày ${data.date} tháng ${data.month}`,
                callback_data: JSON.stringify({
                    case: "SetTime",
                    value: data.date,
                })
            }])
        }
        inline_keyboard.push([{
            text: "Close",
            callback_data: JSON.stringify({
                case: "Close"
                // value: "Đã đóng"
            })
        }])
        // console.log(inline_keyboard)
        // await bot.editMessageReplyMarkup({ inline_keyboard }, { chat_id, message_id })
        await bot.editMessageText("Chọn ngày bạn muốn đăng (giờ ngẫu nhiên nha :V)", {
            chat_id,
            message_id,
            reply_markup: { inline_keyboard }
        })
    } catch (error) {
        console.log(error);
        await bot.sendMessage(chat_id, JSON.stringify(error))
    }
}