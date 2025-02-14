import type { Page } from "puppeteer"
import { clickFinishButton, wait, clickStudyProgram, clickSubmitButton, formatAns } from "./utility"

export async function answerForSelection(page: Page, index: number) {
    const answer = await getAnswerForSelection(page)
    if (answer === -1) throw Error("定義されていない解答です!")
    await clickFinishButton(page)
    await wait()

    await clickStudyProgram(page, index)
    await wait()

    await clickInput(page, answer)
    await wait()

    await clickSubmitButton(page)
    await wait()

    await clickFinishButton(page)
}

async function clickInput(page: Page, index: number) {
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

async function getAnswerForSelection(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", element => {
        return formatAns(element.innerHTML)
    })
    return ANSWER_INDEXS.indexOf(answer)
}

export async function isSelection(page: Page) {
    const textList = await page.$(".answer-inner > div.content > ul.spen-mod-label-text-list")
    return Boolean(textList)
}