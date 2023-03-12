const fs = require('fs')
module.exports = function (pathFile, filename, timeCheck = 2000) {
    return new Promise((resolve) => {
          const interval = setInterval(() => {
                fs.readdir(pathFile, (err, data) => {
                  //     console.log(data)
                      if (err) {
                            console.error(err)
                            clearInterval(interval)
                            resolve(false)
                      }
                      const isDown = data.find(file => file.includes(filename))
                  //     console.log(filename)
                  //     console.log(isDown)
                      if (isDown && isDown.includes('.crdownload')) {
                            return
                      } else {
                            clearInterval(interval)
                            resolve(isDown)
                      }
                })
          }, 2000)
    })
}