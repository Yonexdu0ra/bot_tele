const fs = require('fs');
module.exports = function (pathFile, filename, timeCheck = 2000) {
    return new Promise((resolve) => {
          const interval = setInterval(() => {
                fs.readdir(process.env.PATH_DOWNLOAD_FILE, (err, data) => {
                      if (err) {
                            // console.error(err)
                            clearInterval(interval)
                            resolve(false)
                      }
                      const isDown = data.find(file => file.includes(filename))
                      if (isDown && isDown.includes('.crdownload')) {
                            return
                      } else {
                            clearInterval(interval)
                            resolve(data.find(file => file.includes(filename)))
                      }
                })
          })
    }, timeCheck)
}