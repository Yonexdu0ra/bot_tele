import { config } from "dotenv"
config()
export default (url) => ({
    url,
    snaptik_url: process.env.SNAPTIK_URL,
    input: "input#token",
    api_download_video: process.env.API_DOWNLOAD_VIDEO
})