import isLeapYear from "./isLeapYear.js";
export default function (month, year = new Date().getYear()) {
    let daysInMonth;
    switch (month) {
        case 2:
            daysInMonth = isLeapYear(year) ? 29 : 28;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            daysInMonth = 30;
            break;
        default:
            daysInMonth = 31;
            break;
    }
    return daysInMonth;
}