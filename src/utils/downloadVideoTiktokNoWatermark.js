import axios from "axios"
import { createWriteStream } from "fs"
export default async function (page, options = {}) {
    try {
        await page.goto(options.fpt_url)
        await page.waitForSelector(options.input)
        const token = await page.evaluate((selector) => {
            const input = document.querySelector(selector)
            return input ? input.value : ""
        }, options.input)
        const { data } = await axios.post(options.api_download_video, {
            url: options.url,
            token
        })
        const fileName = `${data.title.split(" ").join('')}.tools.fpttelecom.com.mp4`
        const writer = createWriteStream(`${options.dir}${fileName}`)
        const urlVideo = data.medias.find(video => video.quality == "hd")
        const response = await axios({
            url: urlVideo.url,
            method: "GET",
            responseType: "stream"
        })
        response.data.pipe(writer)
        return new Promise((resolve, reject) => {
            writer.on("finish", () =>  resolve(fileName));
            writer.on("error", reject)
        })
    } catch (error) {
        console.log(error);
    }
}