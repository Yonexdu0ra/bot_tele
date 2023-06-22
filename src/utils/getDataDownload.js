import axios from "axios"
export default async function (token, { url, api_download_video }) {
    try {
        const { data } = await axios.post(api_download_video, {
            url,
            token
        })
        return data
    } catch (error) {
        console.error(error)
    }
}