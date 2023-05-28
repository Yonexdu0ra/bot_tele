import { config } from "dotenv"
config()
export default (url, dir) => ({
    url,
    fpt_url: process.env.FPT_URL,
    input: 'input#token',
    api_download_video: process.env.API_DOWNLOAD_VIDEO,
    selector_download: 'a#tt2-no-watermark-mp4-hd[_name]',
    dir
})