import puppeteer from "puppeteer";
import { solveTasks } from "./task";
import { login } from "./login";
import { isDev, wait } from "@/utility";
import { defaultLog } from "@/log";

const BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_complete"

async function getCookie() {
    if (isDev) {
        const browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222'
        })
        return browser.cookies()
    } else {
        return login()
    }
}

export async function run() {

    const cookies = await getCookie()
    await wait()

    const browser = await puppeteer.launch({
        headless: true
    })

    await browser.setCookie(...cookies)

    const pages = await browser.pages()
    const page = pages[0]

    //webdriverというブラウザがbotかどうか判別できるプロパティを削除
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', () => { });
        //@ts-ignore
        delete navigator.__proto__.webdriver;
    });

    await page.goto(BASE_URL, { waitUntil: ['load', 'networkidle0', 'domcontentloaded'] })
    await wait()

    defaultLog("AutoClassi起動")
    await solveTasks(page, BASE_URL)
}