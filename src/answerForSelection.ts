import type { Page } from "puppeteer"
import { clickFinishButton, wait, clickStudyProgram, clickSubmitButton, formatClassiAns, random } from "./utility"

export async function setAnswerForSelection(page: Page, index: number) {
    const inputs = await page.$$(".checkbox")
    await inputs[index].click()
}

export async function setRandomAnswerForSelection(page: Page) {
    const inputs = await page.$$(".checkbox")
    await inputs[random(inputs.length)].click()
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

const ANSWER_INDEXS2 = [
    "①",
    "②",
    "③",
    "④",
    "⑤",
    "⑥",
    "⑦",
    "⑧",
    "⑨"
]

export async function getAnswerForSelection(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", element => {
        return element.innerHTML
    })
    let index = ANSWER_INDEXS.indexOf(formatClassiAns(answer))
    if (index !== -1) {
        return index
    } else {
        return ANSWER_INDEXS2.indexOf(formatClassiAns(answer))
    }
}

export async function isSelection(page: Page) {
    const textList = await page.$(".selectors-preview-list")
    return Boolean(textList)
}