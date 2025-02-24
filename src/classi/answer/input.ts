import { Page } from "puppeteer"
import { formatAnswer } from "./answer"
import { getElement, wait } from "@/utility"

let inputAnswers: string[]

export async function isInput(page: Page) {
    const check = await page.$("input[type=text]")
    return check !== null
}

export async function getInputAnswer(page: Page) {
    const answers = await page.$$eval(".answer-inner .correct-page-input dd", dds => dds.map(dd => dd.innerText))
    inputAnswers = answers.map(answer => formatAnswer(answer))
    console.log(`答え:${inputAnswers}`)
}

export async function setInputAnswer(page: Page) {
    const inputs = await page.$$("input[type=text]")
    let i: number
    for (i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        await input.type(inputAnswers[i])
    }
}