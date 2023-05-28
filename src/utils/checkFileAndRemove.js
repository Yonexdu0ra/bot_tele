import { existsSync, unlink } from "fs"
export default function (path) {
    if (existsSync(path)) {
        unlink(path, (err) => {
            if (err) throw err;
        })
    }
}