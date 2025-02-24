import type { ElementHandle, Page } from "puppeteer";
import { formatAnswer } from "./answer";
import { getElement } from "@/utility";

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

export async function setCheckBoxAnswer(page: Page) {
    const lists = await page.$$(".selectors-preview-list > li")

    //選択肢を取得
    const choices = await getChoices(lists)
    console.log(`選択肢:${choices}`)

    const checkBox = await getCheckBoxs(lists)

    const index = choices.indexOf(checkBoxAnswer)

    await checkBox[index].click()
}

async function getChoices(elements: ElementHandle<HTMLElement>[]) {
    return Promise.all(
        elements.map(async element => {
            const choice = await element.$eval("div.select-substance", div => div.innerText)
            return formatAnswer(choice)
        }))
}

async function getCheckBoxs(elements: ElementHandle<HTMLElement>[]) {
    return Promise.all(
        elements.map(async element => getElement(element, "input"))
    )
}