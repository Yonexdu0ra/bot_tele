module.exports = function t(str) {
    str ? str = str.toString() : str
    if (!str) {
        return []
    }
    // Tìm kiếm url trong chuỗi
    const urlPattern = /(https?:\/\/[^\s]+)/;
    // console.log(str.match(urlPattern))
    const url = str.match(urlPattern)[1];

    // Tìm kiếm chuỗi sau dấu "|"
    const textPattern = /\|(.+)/;
    // console.log(str.match(textPattern))
    const text = str.match(textPattern)[1];

    return [url, text] 
}