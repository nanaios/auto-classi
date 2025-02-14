import type { Page } from "puppeteer"
import { wait, clickFinishButton } from "./utility"

export async function answerForSelf(page: Page) {
    const button = await page.$$(".radio.self_rating")
    await button[0].click()
    await wait(1000)
    await clickFinishButton(page)
}
export async function isSelf(page: Page) {
    const isCorrect = await page.$(".text.is-correct")
    return Boolean(isCorrect)
}