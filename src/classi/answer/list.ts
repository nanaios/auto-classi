import type { ElementHandle, Page } from "puppeteer";
import { formatAnswer } from "./answer";
import { detailedLog, wait } from "@/utility";

let listAnswer: string[]

export async function isList(page: Page) {
    const check = await page.$("div.image-select-box")
    return check !== null
}

export async function getListAnswer(page: Page) {
    const answers = await page.$$eval(".answer-inner dd", answers => answers.map(answer => answer.innerText))
    listAnswer = answers.map(answer => formatAnswer(answer))
    console.log(`答え:${listAnswer}`)
}

export async function setListAnswer(page: Page) {
    //全ての選択ボックスを取得
    const lists = await page.$$("ul.option-list")

    //選択肢一覧を取得
    const choices = await getChoices(lists[0])
    console.log(`選択肢:${choices}`)
    let i: number
    for (i = 0; i < lists.length; i++) {
        const list = lists[i]

        //選択ボックスの中の選択肢を取得
        const choiceLists = await list.$$("li")

        //選択肢の中で答えと一致する物の番号を取得する
        const choiceIndex = choices.indexOf(listAnswer[i])
        detailedLog(`リストの番号:${choiceIndex - 1}`)

        //答えの選択肢をクリック
        await choiceLists[choiceIndex].evaluate(li => li.click())
    }
}

async function getChoices(elemet: ElementHandle<HTMLElement>) {
    const answers = await elemet.$$eval("li", divs => divs.map(div => div.innerText))
    return answers.map(answer => formatAnswer(answer).split(":")[1])
}