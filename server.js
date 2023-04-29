import dotenv from "dotenv"
import app from "./src/app.js"
dotenv.config()

app({
    telegram_api_token: process.env.TELEGRAM_API_TOKEN,
    uri_db: `mongodb+srv://${process.env.USERNAME_DB}:${encodeURI(process.env.PASSWORD_DB)}@bot.utkbgol.mongodb.net/?retryWrites=true&w=majority`,
    options_db: { useNewUrlParser: true, useUnifiedTopology: true }
})
