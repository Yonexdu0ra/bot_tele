export default async function (page, options) {
    try {
        if(!options.date) {
            return
        }
        await page.evaluate((options) => {
            const button_turn_on = document.querySelector(options.button_turn_on)
            if (button_turn_on !== null) {
                button_turn_on.click()
                //bật bảng lựa chọn ngày tháng năm upload max khoảng 10
                const modal_date = document.querySelector(options.selector_date)
                if (modal_date !== null) {
                    modal_date.click()
                    let listDate = [...document.querySelectorAll(options.day_valid)]
                    let isDate = listDate.find(date => +(date.textContent?.trim()) === options.date ? date : null)
                    if (isDate) {
                        isDate.click()
                    } else {
                        // next sáng tháng tiếp theo xem 
                        document.querySelector(options.arrow_next_month).click()
                        listDate = [...document.querySelectorAll(options.day_valid)]
                        isDate = listDate.find(date => +(date.textContent?.trim()) === options.date ? date : null)
                        if (isDate) {
                            isDate.click()
                        } else {
                            return
                        }
                    }

                }
            }
        }, options)

    } catch (error) {
        console.log(error)
    }
}