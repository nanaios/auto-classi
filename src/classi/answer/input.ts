import { Page } from "puppeteer"
import { formatAnswer } from "./answer"

let inputAnswer: string

export async function isInput(page: Page) {
    const check = await page.$("input[type=text]")
    return check !== null
}

export async function getInputAnswer(page: Page) {
    const answer = await page.$eval(".correct-page-input dd", dd => dd.innerText)
    inputAnswer = formatAnswer(answer)
    console.log(`答え:${inputAnswer}`)
}