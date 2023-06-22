import { createWriteStream } from "fs"
import axios from "axios"
export default async function (data, dir) {
    try {
        const fileName = `Yonexdu0ra_TikTok_Video_${Math.floor(Math.random() * 100)}.mp4`
        const writer = createWriteStream(`${dir}${fileName}`)
        const video = data.medias.reduce((fristVideoData, lastVideoData) => fristVideoData.size > lastVideoData.size ? fristVideoData : lastVideoData)
        
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
                thumbnail: data.thumbnail ? data.thumbnail : null,
                title: data.title,
                duration: data.duration,
                source: data.source,
                quality: video.quality,
                formattedSize: video.formattedSize,
                temporary_url: video.url
            }));
            writer.on("error", reject)
        }).catch(err => {
            return {}
        })
    }
    catch (e) {
        console.log(e)
    }
}