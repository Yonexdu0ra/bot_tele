export default function (data) {
    const inline_keyboard = []
        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes('is')) {
                if(key === 'isSetTime') {
                    inline_keyboard.push([{
                        text: `${key}: ${data[key] ? 'ON' : 'OFF'}`,
                        callback_data: JSON.stringify({
                            case: "GetTime",
                            value: data[key]
                        })
                    }])
                    continue
                }
                inline_keyboard.push([{
                    text: `${key}: ${data[key] ? 'ON' : 'OFF'}`,
                    callback_data: JSON.stringify({
                        case: "Permission",
                        value: `${key}: ${data[key]}`,
                    })
                }])
            }
        }
        inline_keyboard.push([{
            text: "Close",
            callback_data: JSON.stringify({
                case: "Close",
                value: "Đã đóng"
            })
        }])
        return  inline_keyboard
}