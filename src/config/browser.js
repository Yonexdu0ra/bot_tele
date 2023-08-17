import { config } from "dotenv"
config()
export default {
    headless: false,
    // khuyến khích dùng 1 trình duyệt không hay sử dụng vì khi headless: false mà đang mở tab trình duyệt sẽ gây ra lỗi(hoặc nên dùng headless: true)
    executablePath: process.env.PATH_CHROME, 
    userDataDir: process.env.PATH_DATA_CHROME,
    defaultViewport: null,
    // ignoreHTTPSErrors: true,
    // args: ['--enable-features=JITCompiler']
}