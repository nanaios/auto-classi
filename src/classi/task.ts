import type { ElementHandle, Page } from "puppeteer";
import { detailedLog } from "../utility";

const solvedTaskNames: string[] = []

export async function getTaskName(element: ElementHandle<HTMLElement>) {
    return element.$eval("p.subject", p => p.innerText)
}

export async function* getTasks(page: Page) {
    //最初に課題を取得するための変数
    const tasks = await page.$$(".task-list > a")
    let i: number, k: number

    console.log(`合計課題数:${tasks.length}`)

    for (i = 0; i < tasks.length; i++) {

        //ページの更新でtasksの参照が失われるので、ループの度に変数をセットしなおす
        const tasks = await page.$$(".task-list > a")

        //ループの時点で存在する課題数分ループを回す
        //万が一問題を解き損ねた課題があった場合に備えて、一度処理した課題は飛ばすようにする
        for (k = 0; k < tasks.length; k++) {
            const name = await getTaskName(tasks[k])
            if (solvedTaskNames.includes(name)) {
                detailedLog(`課題[name:${name}]は回答済みなのでスキップします`)
                continue
            } else {
                detailedLog(`\n未回答の課題[name:${name}]を発見しました\n`)
                solvedTaskNames.push(name)
                yield tasks[k]
                break
            }
        }
    }
}