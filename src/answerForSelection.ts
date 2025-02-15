import type { Page } from "puppeteer"
import { formatClassiAns } from "./utility"

export async function setAnswerForSelection(page: Page, index: number) {
    const inputs = await page.$$(".checkbox")
    await inputs[index].click()
}

const ANSWER_INDEXS = [
    "ア",
    "イ",
    "ウ",
    "エ",
    "オ",
    "カ",
    "キ",
    "ク",
    "ケ"
]

export async function getAnswerForSelection(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", element => {
        return element.innerHTML
    })
    return ANSWER_INDEXS.indexOf(formatClassiAns(answer))
}

export async function isSelection(page: Page) {
    const textList = await page.$(".selectors-preview-list")
    return Boolean(textList)
}