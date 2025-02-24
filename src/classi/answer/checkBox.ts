import type { Page } from "puppeteer";
import { formatAnswer } from "./answer";

let checkBoxAnswer: string

export async function isCheckBox(page: Page) {
    const check = await page.$(".selectors-preview-list")
    return check !== null
}

export async function getCheckBoxAnswer(page: Page) {
    const answer = await page.$eval(".spen-mod-label-text-list dd", dd => dd.innerText)
    checkBoxAnswer = formatAnswer(answer)
    console.log(`答え:${checkBoxAnswer}`)
}