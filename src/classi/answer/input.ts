import { Page } from "puppeteer"

export async function isInput(page: Page) {
    const check = await page.$("input[type=text]")
    return check !== null
}