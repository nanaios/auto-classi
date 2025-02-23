import { getElement, wait, waitForClickTransition } from "@/utility";
import type { ElementHandle, Page } from "puppeteer";
import { getQuestionType } from "./answer/answer";

export async function isStudyContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-pencil-square-o")
    return mark !== null
}

export async function solveStudyContent(page: Page, content: ElementHandle<HTMLElement>) {
    await waitForClickTransition(page, content)
    await wait()

    const type = await getQuestionType(page)
    console.log(`問題タイプ:${type}`)

    await clickFinishButton(page)

    await clickFinishButton(page)

    /*
    //"コース詳細へ戻る"ボタンを押す
    const leftLectureButton = await getElement(page, "a.white-btn")
    await waitForClickTransition(page, leftLectureButton)
    await wait() */
}

export async function clickFinishButton(page: Page) {
    const button = await page.$("button[type=button]") ?? await getElement(page, "input[type=submit]")
    await waitForClickTransition(page, button)
    await wait()
}