import puppeteer, { type Page } from "puppeteer";
import { checkElement, wait, waitForTransition } from "./utilitys";

const LOGIN_URL = "https://id.classi.jp/login/identifier"
const LOGIN_EMAIL = "f2024121@kawasaki.kst-h.ed.jp"
const LOGIN_PASSWORD = "#Oq8Fa7#"

async function clickNextButton(page: Page) {
    const buttons = await page.$$("button")
    const buttonIndex = await page.$$eval("button", buttons => {
        let i = -1
        buttons.forEach((button, index) => {
            if (button.innerText === "次へ") {
                i = index
            }
        })
        return i
    })
    const button = buttons[buttonIndex]

    await button.click()
}

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

    const emailInput = checkElement(await popup.$("input[type=email]"))

    await emailInput.type(LOGIN_EMAIL)
    await emailInput.press("Enter")

    await popup.waitForSelector("input[type=password]")

    const passwordInput = checkElement(await popup.$("input[type=password]"))
    await wait()
    await passwordInput.type(LOGIN_PASSWORD)
    await wait()
    await passwordInput.press("Enter")

    await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })

}