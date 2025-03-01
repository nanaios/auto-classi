import puppeteer, { type Page } from "puppeteer";
import { Task } from "./Task";
import { login } from "./login";
import { goTo, wait } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import { setArgsForRunCommand, type RunCommandArgs } from "@/args";
import { isWithInExpirationDate, readCookies, writeCookies } from "@/cookie";

let BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_in_studying"
DEV: BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_complete"

async function getCookie() {
    if (isWithInExpirationDate()) {
        detailedLog(`有効なcookieキャッシュを発見しました`)
        return readCookies()
    }

    DEV: {
        try {
            const browser = await puppeteer.connect({
                browserURL: 'http://127.0.0.1:9222'
            })
            const pages = await browser.pages()
            const page = pages[0]
            return page.cookies()
        } catch (error) {
            detailedLog(`Chromeへの接続に失敗`)
        }
    }
    return login()
}

export async function run(args: RunCommandArgs) {
    setArgsForRunCommand(args)

    const cookies = await getCookie()
    await wait()

    writeCookies(cookies)

    const browser = await puppeteer.launch({
        headless: !args.nonHeadless
    })

    await browser.setCookie(...cookies)

    const pages = await browser.pages()
    const page = pages[0]

    await deleteWebdriver(page)

    await goTo(page, BASE_URL)
    await wait()

    defaultLog("AutoClassi起動")

    await new Task(page, BASE_URL).solves()
}

/**
 * Webdriverの値をを削除して、bot判定を回避する
 * @param page 
 */
const deleteWebdriver = async (page: Page) => {
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', () => { });
        //@ts-ignore
        delete navigator.__proto__.webdriver;
    });
}