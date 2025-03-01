import type { ElementHandle, Page } from "puppeteer";
import { formatAnswer } from "./answer";
import { getElement } from "@/utility";
import { defaultLog } from "@/log";

let checkBoxAnswer: string

export async function isCheckBox(page: Page) {
    const check = await page.$(".selectors-preview-list")
    return check !== null
}

"https://platform.classi.jp/api/cbank/4f0ae4e0e2aafa1f11f28aef63a70c2cc92aa49c"
"https://platform.classi.jp/api/cbank/4f0ae4e0e2aafa1f11f28aef63a70c2cc92aa49c"

export async function getCheckBoxAnswer(page: Page) {
    const answer = await page.$eval(".spen-mod-label-text-list dd", dd => dd.innerText)
    if (answer) {
        checkBoxAnswer = formatAnswer(answer)
        defaultLog(`答え:"${checkBoxAnswer}"`)
    } else {
        const url = await page.$eval(".spen-mod-label-text-list img", img => img.src)
        checkBoxAnswer = url
        defaultLog(`答え:"${checkBoxAnswer}"`)
    }
}

export async function setCheckBoxAnswer(page: Page) {
    const lists = await page.$$(".selectors-preview-list > li")

    //選択肢を取得
    const choices = await getChoices(lists)
    defaultLog(`選択肢:${choices}`)

    //チェックボックスを取得
    const checkBox = await getCheckBoxs(lists)

    //答えと一致する選択肢の番号を取得
    const index = choices.indexOf(checkBoxAnswer)

    //チェックボックスをクリック
    await checkBox[index].click()
}

async function getChoices(elements: ElementHandle<HTMLElement>[]) {
    return Promise.all(
        elements.map(async element => {
            const choice = await element.$eval("div.select-substance", div => div.innerText)
            if (choice) {
                return formatAnswer(choice)
            } else {
                return element.$eval("img", img => img.src)
            }
        }))
}

async function getCheckBoxs(elements: ElementHandle<HTMLElement>[]) {
    return Promise.all(
        elements.map(async element => getElement(element, "input"))
    )
}