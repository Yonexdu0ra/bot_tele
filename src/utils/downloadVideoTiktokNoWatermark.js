import axios from "axios"
import { createWriteStream } from "fs"
export default async function (page, options = {}) {
    try {
        // const url = await page.evaluate(() => window.location.href)
        // console.log(url)
        await page.goto(options.fpt_url)
        await page.waitForSelector(options.input)
        const data = await page.evaluate(async (selector_input, url_video, api_download_video) => {
            const token = document.querySelector(selector_input).value
            try {
                const res = await fetch(api_download_video, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                     },
                    body: JSON.stringify(
                        {
                            url: url_video,
                            token
                       }
                    )
                })
                const data = await res.json()
                return data
            } catch (error) {
                return error
            }
        }, options.input, options.url, options.api_download_video)
        if (data.error) {
            return data
        }
        const fileName = `Yonexdu0ra_TikTok_Video_${Math.floor(Math.random() * 100)}.mp4`
        const writer = createWriteStream(`${options.dir}${fileName}`)
        const video = data.medias.find(video => video.quality == "hd" || video.quality == "sd")
        const response = await axios({
            url: video.url,
            method: "GET",
            responseType: "stream"
        })
        response.data.pipe(writer)
        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve({
                fileName,
                url: data.url,
                thumbnail: data.thumbnail,
                title: data.title,
                duration: data.duration,
                source: data.source,
                quality: video.quality,
                formattedSize: video.formattedSize
            }));
            writer.on("error", reject)
        }).catch(err => {
            return ""
        })
    } catch (error) {
        console.log(error);
        return { error }
    }
}