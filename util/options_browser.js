module.exports = {
    headless: true,
    executablePath: process.env.PATH_CHROME,
    userDataDir: process.env.PATH_DATA_CHROME,
    ignoreHTTPSErrors: true,
    defaultViewport: null
}