import type { Page } from "puppeteer"
import { clickFinishButton, wait, clickStudyProgram, clickSubmitButton, formatClassiAns } from "./utility"

export async function isMultiInput(page: Page) {
    const correct = await page.$$(".answer-inner > div.content > div.correct-page-input")
    return (correct.length > 1)
}

export async function answerForMultiInput(page: Page, index: number) {
    const answers = await getAnswerMultiForInput(page)
    await clickFinishButton(page)
    await wait()

    await clickStudyProgram(page, index)
    await wait()

    await setAnswerForMultiInput(page, answers)
    await wait()

    await clickSubmitButton(page)
    await wait()

    await clickFinishButton(page)
}


async function getAnswerMultiForInput(page: Page) {
    const answers = await page.$$eval(".answer-inner > div.content > div > dl > dd", elements => elements.map(element => {
        return element.innerText
    }))
    return answers.map(answer => formatClassiAns(answer))
}

async function setAnswerForMultiInput(page: Page, answers: string[]) {
    for (let i = 0; i < answers.length; i++) {
        await page.type(`.spen-mod-input-label-list > li:nth-child(${i + 1}) > input`, answers[i])
        await wait()
    }
}