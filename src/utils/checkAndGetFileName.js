import { readdir } from "fs"
export default function (pathFile, fileName) {
    // hàm này sẽ trả ra kết quả không mong muốn khi trong thư mục chứa video có nhiều file video có đuôi fpttelecom.com.mp4
    return new Promise((resolve, reject) => {
        readdir(pathFile, (err, data) => {
            if (err) {
                reject(err)
            }
            let isFile = data.find(file => file.includes(fileName))
            if (!isFile) {
                isFile = data.find(file => file.endsWith(".mp4"))
            }
            resolve(isFile ? isFile : "")
        })
    })
        .catch(err => {
            console.log(`checkAndGetFileName:: ${err}`)
            return ""
        })
}