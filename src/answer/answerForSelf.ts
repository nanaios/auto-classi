import type { Page } from "puppeteer-core"

export async function setAnswerForSelf(page: Page, isCollect: boolean) {
    const button = await page.$$(".radio.self_rating")
    const index = isCollect ? 0 : 1
    await button[index].click()
}
export async function isSelf(page: Page) {
    try {
        const text = await page.$eval(".question-select > p.supplement-text", elment => elment.innerText)
        return (text === "解答完了後、自己採点をしてください。")
    } catch (error) {
        return false
    }
}