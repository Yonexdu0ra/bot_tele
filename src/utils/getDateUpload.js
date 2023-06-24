import getDaysInMonth from './getDaysInMonth.js'
export default function (date, month, max_date = 10) {
    const listDate = []
    if (!date || !month) {
        return []
    }
    for (let i = 0; i < max_date; i++) {
        if (date > getDaysInMonth(month)) {
            date = 1
            if(month > 12) {
                month = 1
            }
            month++
        }
        listDate.push({date, month})
        date++
    }
    return listDate
}