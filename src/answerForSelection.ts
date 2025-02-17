import type { Page } from "puppeteer"
import { formatClassiAns, random, wait } from "./utility"

export async function setAnswerForSelection(page: Page, answers: string[]) {
    const inputs = await page.$$(".checkbox")
    const selections = (await page.$$eval(".select-substance", inputs => {
        return (inputs as unknown as HTMLElement[]).map(input => input.innerText)
    })).map(selection => formatClassiAns(selection))
    for (const answer of answers) {
        await inputs[selections.indexOf(answer)].click()
        await wait()
    }
}

export async function setRandomAnswerForSelection(page: Page) {
    const inputs = await page.$$(".checkbox")
    await inputs[random(inputs.length)].click()
}

export async function getAnswerForSelection(page: Page) {
    const answer = await page.$$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", elements => {
        return elements.map(element => element.innerText)
    })
    console.log(`答え:${answer}`)
    return answer
}

export async function isSelection(page: Page) {
    const textList = await page.$(".selectors-preview-list")
    return Boolean(textList)
}