import { getElement, goBack, wait, waitForClickTransition } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import type { ElementHandle, Page } from "puppeteer";
import { getAnswer, getQuestionType, setAnswer } from "./answer/answer";

export async function isStudyContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-pencil-square-o")
    return mark !== null
}

export async function solveStudyContent(page: Page, content: ElementHandle<HTMLElement>) {
    await waitForClickTransition(page, content)

    const type = await getQuestionType(page)
    defaultLog(`問題タイプ:${type}`)

    //一度答えを取得するために正答確認ページに行く
    await clickFinishButton(page)
    detailedLog(`正答確認ページに遷移`)

    //答えを取得
    await getAnswer(page, type)

    //解答ページに戻る
    await goBack(page)
    detailedLog("解答ページに戻る")

    await setAnswer(page, type)

    await clickFinishButton(page)
}

export async function clickFinishButton(page: Page) {
    const button = await page.$("button[type=button]") ?? await getElement(page, "input[type=submit]")
    await waitForClickTransition(page, button)
}