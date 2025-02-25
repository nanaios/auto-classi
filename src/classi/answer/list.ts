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
        detailedLog(`リストの番号:${choiceIndex}`)

        //答えの選択肢をクリック
        //この時、実際のindexは先頭に"選択してください"が存在するため、indexを1ずらす必要がある
        await choiceLists[choiceIndex + 1].evaluate(li => li.click())
    }
}

async function getChoices(elemet: ElementHandle<HTMLElement>) {
    const answers = await elemet.$$eval("li", divs => divs.map(div => div.innerText))

    //"選択してください"の部分もanswersに入ってしまうため、削除する
    answers.shift()

    //listを展開しない場合、innerTextに"0:"のような邪魔な部分が入ってしまう
    //正規表現で先頭の部分を無くすことで正しい答えを得られるようにする
    return answers.map(answer => formatAnswer(answer).replace(/\d+:/, ""))
}