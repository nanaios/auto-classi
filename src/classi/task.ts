import type { ElementHandle, Page } from "puppeteer";
import { detailedLog, getElement, isSolved, wait, waitForClickTransition } from "../utility";
import { solveLectures } from "./lecture";

const solvedTaskNames: string[] = []

let skip = true

async function getTaskName(element: ElementHandle<HTMLElement>) {
    return element.$eval("p.subject", p => p.innerText)
}

async function* getTasks(page: Page) {
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
                detailedLog(`課題[name:${name}]は処理済みなのでスキップします`)
                continue
            } else {
                detailedLog(`未回答の課題[name:${name}]を発見しました`)
                solvedTaskNames.push(name)
                break
            }
        }
        if (await isSolved(tasks[k])) {
            const name = await getTaskName(tasks[k])
            detailedLog(`課題[name:${name}]はすでに回答済みなのでスキップします`)
        } else {
            yield tasks[k]
        }
    }
}

async function solveTask(page: Page, task: ElementHandle<HTMLElement>) {
    const name = await getTaskName(task)

    if (name === process.argv[2]) {
        skip = false
    }

    if (skip) return;

    console.log(`課題[name:${name}]の解答を開始`)
    console.group()

    //課題の詳細ページへ遷移
    await waitForClickTransition(page, task)

    //"課題に取り組む"ボタンを押す
    const startTaskButton = await getElement(page, ".right > a.navy-btn")
    await waitForClickTransition(page, startTaskButton)

    await solveLectures(page)
    console.groupEnd()
    console.log(`課題[name:${name}]の解答を終了`)
}

export async function solveTasks(page: Page, url: string) {
    for await (const task of getTasks(page)) {
        //課題の解答を開始
        await solveTask(page, task);
        await wait()

        //元のページへ戻る
        await page.goto(url, { waitUntil: ['load', 'networkidle0'] })
        await wait()
    }
}