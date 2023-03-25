const fs = require('fs')
module.exports = function (path) {
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
            if (err) throw err;
            // console.log('File đã bị xóa!');
        })
    }
}