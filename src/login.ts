import puppeteer, { type Page } from "puppeteer";
import { checkElement, wait } from "./utilitys";
import { saveCookie } from "./cookie";
import { configJson } from "./config";

const LOGIN_URL = "https://id.classi.jp/login/identifier"
const LOGIN_EMAIL = configJson["login-email"]
const LOGIN_PASSWORD = configJson["login-password"]

export async function login() {

    const browser = await puppeteer.launch({ headless: false })

    const pages = await browser.pages()
    const page = pages[0]

    await page.goto(LOGIN_URL, { waitUntil: ['load', 'networkidle2'] })


    const loginButtons = await page.$$("button.spen-button.is-normal.is-full")
    const button = loginButtons[1]

    const [popup] = await Promise.all([
        new Promise<Page>((resolve) => page.once('popup', async event => {
            if (event) {
                await event.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
                resolve(event)
            } else {
                throw new Error("ポップアップを取得できませんでした")
            }
        })),
        await button.click()
    ])

    await popup.bringToFront()

    const emailInput = checkElement(await popup.$("input[type=email]"))

    await emailInput.type(LOGIN_EMAIL)
    console.info("メールアドレス入力")
    await emailInput.press("Enter")

    await popup.waitForSelector("input[type=password]")
    await wait(5000)

    const passwordInput = checkElement(await popup.$("input[type=password]"))
    await wait()
    await passwordInput.type(LOGIN_PASSWORD)
    console.info("パスワード入力")
    await wait()
    await passwordInput.press("Enter")

    await page.bringToFront()

    await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    console.info("ログイン成功")
    await wait()

    await saveCookie(page)
    console.info("cookie保存成功")
    await wait()

    await page.close()
}