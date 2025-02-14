import type { Page } from "puppeteer"
import { clickFinishButton, wait, clickStudyProgram, clickSubmitButton } from "./utility"

export async function anserForSelection(page: Page, index: number) {
    const answer = await getAnswerSelection(page)
    if (answer === -1) throw Error("定義されていない解答です!")
    await clickFinishButton(page)
    await wait(1000)

    await clickStudyProgram(page, index)
    await wait(1000)

    await clickInput(page, answer)
    await wait(1000)

    await clickSubmitButton(page)
    await wait(1000)

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

async function getAnswerSelection(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", element => {
        return element.innerHTML
    })
    return ANSWER_INDEXS.indexOf(answer)
}