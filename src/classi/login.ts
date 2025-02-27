import { goTo, wait } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import puppeteer from "puppeteer";

const LOGIN_URL = "https://id.classi.jp/login/identifier"

export async function login() {
    const browser = await puppeteer.launch({
        timeout: 0,
        headless: false
    })

    detailedLog("ログイン用ブラウザを起動")

    const pages = await browser.pages()
    const page = pages[0]

    await goTo(page, LOGIN_URL)
    await wait()

    detailedLog("ログイン待機状態に移行")
    await page.waitForNavigation({ timeout: 0, waitUntil: ['load', 'networkidle0', 'domcontentloaded'] })
    await wait()

    defaultLog("ログイン成功")

    //cookieを取得
    const cookies = await browser.cookies()
    await browser.close()
    return cookies
}