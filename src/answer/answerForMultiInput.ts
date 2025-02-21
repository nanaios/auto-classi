import type { Page } from "puppeteer-core"
import { wait, formatClassiAns } from "../utilitys/utility"

export async function isMultiInput(page: Page) {
    const correct = await page.$$(".spen-mod-input-label-list > li")
    return (correct.length > 1)
}

export async function getAnswerForMultiInput(page: Page) {
    const answers = await page.$$eval(".answer-inner > div.content > div > dl > dd", elements => elements.map(element => {
        return element.innerText
    }))
    const formatAnswers = answers.map(answer => formatClassiAns(answer))
    console.log(`答え:${formatAnswers}`)
    return formatAnswers
}

export async function setAnswerForMultiInput(page: Page, answers: string[]) {
    for (let i = 0; i < answers.length; i++) {
        await page.type(`.spen-mod-input-label-list > li:nth-child(${i + 1}) > input`, answers[i])
        await wait()
    }
}