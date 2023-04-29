export default function (str) {
    const urlPattern = /(https?:\/\/[^\s]+)/
    const url = str.match(urlPattern)
    const textPattern = /\|(.+)/
    const content = str.match(textPattern)
    return { url: url ? url[1] : '', content: content ? content[1] : '' }
}