import type { Page } from "puppeteer";
import { formatClassiAns, log } from "@/utilitys";

export async function isInput(page: Page) {
    const correct = await page.$$(".spen-mod-input-label-list > li")
    return (correct.length === 1)
}
export async function setAnswerForInput(page: Page, answer: string) {
    await page.type(".spen-mod-input-label-list > li > input", answer)
}

export async function getAnswerForInput(page: Page) {
    const rawAnswer = await page.$eval(".answer-inner > div.content > div > dl > dd", element => element.innerText)
    const answer = formatClassiAns(rawAnswer)
    log(`答え:${answer}`)
    return answer
}