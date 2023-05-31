import axios from "axios"
import { createWriteStream } from "fs"
export default async function (page, options = {}) {
    try {
        await page.goto(options.fpt_url)
        await page.waitForSelector(options.input)
        const data = await page.evaluate(async (selector, url) => {
            const input = document.querySelector(selector)
            const options = {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        url: encodeURI(url),
                        token: input.value
                    }
                )
            }
            try {
                const data = await fetch(`https://tools.fpttelecom.com/wp-json/aio-dl/video-data/`, options)
                return (await data.json())
            } catch (error) {
                console.error(error)
                return error
            }
        }, options.input, options.url)
        // const { data } = await axios.post(options.api_download_video, {
        //     url: options.url,
        //     token
        // })
        // console.log(data)
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
        })
    } catch (error) {
        console.log(error);
    }
}