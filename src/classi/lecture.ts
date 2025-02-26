import { getElement, waitForClickTransition } from "@/utility";
import type { ElementHandle, Page } from "puppeteer";
import { solveContents } from "./content";
import { defaultLog } from "@/log";

async function getLectureName(element: ElementHandle<HTMLElement>) {
    return element.$eval("span.lecture_name", span => span.innerText)
}
async function* getLectures(page: Page) {
    const lectures = await page.$$(".task-list > a")
    defaultLog(`合計講義数:${lectures.length}`)
    let i: number
    for (i = 0; i < lectures.length; i++) {
        const lectures = await page.$$(".task-list > a")
        yield lectures[i]
    }
}

async function solveLecture(page: Page, lecture: ElementHandle<HTMLElement>) {
    const name = await getLectureName(lecture)
    defaultLog(`講義[name:${name}]の解答を開始`)
    console.group()

    //講義の解答を開始
    await waitForClickTransition(page, lecture)

    await solveContents(page)
    console.groupEnd()
    defaultLog(`講義[name:${name}]の解答を終了`)
}

export async function solveLectures(page: Page) {
    for await (const lecture of getLectures(page)) {
        //講義の解答を開始
        await solveLecture(page, lecture)

        //"コース詳細へ戻る"ボタンを押す
        const leftLectureButton = await getElement(page, "a.white-btn")
        await waitForClickTransition(page, leftLectureButton)
    }
}