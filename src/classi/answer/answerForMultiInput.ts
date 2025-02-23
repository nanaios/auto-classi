import type { Page } from "puppeteer"
import { wait, formatClassiAns, log } from "@/utilitys"

export async function isMultiInput(page: Page) {
    const correct = await page.$$(".spen-mod-input-label-list > li")
    return (correct.length > 1)
}

export async function getAnswerForMultiInput(page: Page) {
    const answers = await page.$$eval(".answer-inner > div.content > div > dl > dd", elements => elements.map(element => {
        return element.innerText
    }))
    const formatAnswers = answers.map(answer => formatClassiAns(answer))
    log(`答え:${formatAnswers}`)
    return formatAnswers
}

export async function setAnswerForMultiInput(page: Page, answers: string[]) {
    for (let i = 0; i < answers.length; i++) {
        await page.type(`.spen-mod-input-label-list > li:nth-child(${i + 1}) > input`, answers[i])
        await wait()
    }
}