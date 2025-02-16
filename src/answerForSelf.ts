import type { Page } from "puppeteer"
import { wait } from "./utility"

export async function setAnswerForSelf(page: Page, isCollect: boolean) {
    const button = await page.$$(".radio.self_rating")
    const index = isCollect ? 0 : 1
    await button[index].click()
    await wait()
    const finish = await page.$(".btn-area.clearfix.no-interval > li.right > i > input.navy-btn")
    if (!finish) throw Error("buttonが存在しません!");
    await Promise.all(
        [
            await finish.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}
export async function isSelf(page: Page) {
    try {
        const text = await page.$eval(".question-select > p.supplement-text", elment => elment.innerText)
        return (text === "解答完了後、自己採点をしてください。")
    } catch (error) {
        return false
    }
}