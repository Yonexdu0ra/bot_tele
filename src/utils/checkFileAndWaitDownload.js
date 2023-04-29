import { readdir } from "fs"
export default function (pathFile, filename, timeCheck = 2000) {
    return new Promise((resolve) => {
          const interval = setInterval(() => {
                readdir(pathFile, (err, data) => {
                      if (err) {
                            console.error(err)
                            clearInterval(interval)
                            resolve(false)
                      }
                      const isDown = data.find(file => file.includes(filename))
                      if (isDown && isDown.includes(".crdownload")) {
                            return
                      } else {
                            clearInterval(interval)
                            resolve(isDown)
                      }
                })
          }, timeCheck)
    })
}