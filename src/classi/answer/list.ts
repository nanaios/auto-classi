import type { Page } from "puppeteer";
import { formatAnswer } from "./answer";

let listAnswer: string[]

export async function isList(page: Page) {
    const check = await page.$("div.image-select-box")
    return check !== null
}

export async function getSelectLists(page: Page) {
    return page.$$("div.image-select-box")
}

export async function getListAnswer(page: Page) {
    const answers = await page.$$eval(".answer-inner dd", answers => answers.map(answer => answer.innerText))
    listAnswer = answers.map(answer => formatAnswer(answer))
    console.log(`答え:${listAnswer}`)
}

