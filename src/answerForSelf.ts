import type { Page } from "puppeteer"
import { wait } from "./utility"

export async function setAnswerForSelf(page: Page) {
    const button = await page.$$(".radio.self_rating")
    await button[0].click()
    await wait()
}
export async function isSelf(page: Page) {
    const text = await page.$eval(".question-select > p.supplement-text", elment => elment.innerText)
    return (text === "解答完了後、自己採点をしてください。")
}