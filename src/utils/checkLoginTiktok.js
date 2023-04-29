export default async function (page) {
    const url = await page.evaluate(() => window.location.href)
    return !(url.includes('login'))
}