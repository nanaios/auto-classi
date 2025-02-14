import type { Page } from "puppeteer";
import { clickFinishButton, clickStudyProgram, clickSubmitButton, wait } from "./utility";

export async function isInput(page: Page) {
    const correct = await page.$$(".answer-inner > div.content > div.correct-page-input")
    return (correct.length === 1)
}

export async function answerForInput(page: Page, index: number) {
    const answer = await getAnswerForInput(page)
    await clickFinishButton(page)
    await wait()

    await clickStudyProgram(page, index)
    await wait()

    await setAnswerForInput(page, answer)
    await wait()

    await clickSubmitButton(page)
    await wait()

    await clickFinishButton(page)
}

async function setAnswerForInput(page: Page, answer: string) {
    await page.type(".spen-mod-input-label-list > li > input", answer)
}

async function getAnswerForInput(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > div > dl > dd", element => element.innerText)
    return answer.split("(")[0]
}