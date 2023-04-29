import { config } from "dotenv"
config()
export default {
    headless: true,
    executablePath: process.env.PATH_CHROME,
    userDataDir: process.env.PATH_DATA_CHROME,
    defaultViewport: null
}