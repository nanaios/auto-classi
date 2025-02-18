import type { Page, ElementHandle } from "puppeteer";
import { BASE_WAIT_TIME, isDev } from "./status";

export async function* getStudyPrograms(page: Page) {
    const lilsts = await page.$$(".spen-mod-item-list.is-column-1.spen.spen-util-mb-24.lecture-flow > li")
    console.log(`合計問題数:${lilsts.length}`)
    for (let i = 0; i < lilsts.length; i++) {
        const lilsts = await page.$$(".spen-mod-item-list.is-column-1.spen.spen-util-mb-24.lecture-flow > li")
        yield lilsts[i]
    }
}

export async function isStudyPrograms(list: ElementHandle<HTMLElement>) {
    const icon = await list.$(".fa-pencil-square-o")
    return Boolean(icon)
}

export async function isVideoPrograms(list: ElementHandle<HTMLElement>) {
    const icon = await list.$(".fa-film")
    return Boolean(icon)
}

export async function getStudyProgramName(list: ElementHandle<HTMLElement>) {
    const name = await list.$eval("a", element => element.innerText)
    return name
}

export function wait(ms: number = BASE_WAIT_TIME) {
    return new Promise<void>(res => {
        const id = setTimeout(() => {
            clearTimeout(id)
            res()
        }, ms)
    })
}

export function formatClassiAns(rawAns: string) {
    return rawAns.replace(/\n/g, "").replace(/\t/g, "").split("(")[0].trim()
}

export async function getLectureName(task: ElementHandle<HTMLElement>) {
    const label = await task.$eval(".simple-task-name > p > span.lecture_name", element => element.innerText)
    return label
}

export function random(max: number) {
    return Math.floor(Math.random() * max);
}

export async function copyPage(page: Page) {
    const copy = await page.browser().newPage()
    await copy.goto(page.url(), { waitUntil: ['load', 'networkidle2'] })
    return copy
}

export async function isCorrectProgram(list: ElementHandle<HTMLElement>) {
    if (isDev) return false
    const correctIconSrc = await list.$eval("a > p > img", img => img.src)
    return !(correctIconSrc.includes("incorrect"))
}

export async function isChecked(list: ElementHandle<HTMLElement>) {
    if (isDev) return false
    const chekeMark = await list.$(".check-mark")
    return Boolean(chekeMark)
}

export async function getAssignmentName(page: Page) {
    return await page.$eval("dd.task-user-name", element => element.innerText)
}

export async function* getAssignments(page: Page) {
    const assignments = await page.$$(".task-list > a")
    console.log(`合計課題数:${assignments.length}`)
    for (let i = 0; i < assignments.length; i++) {
        const assignments = await page.$$(".task-list > a")
        if (isDev) {
            yield assignments[i]
        } else {
            yield assignments[0]
        }
    }
}

export async function* getLectures(page: Page) {
    const lectures = await page.$$(".task-list > a")
    console.log(`合計講義数：${lectures.length}個`)
    for (let i = 0; i < lectures.length; i++) {
        const lectures = await page.$$(".task-list > a")
        yield lectures[i]
    }
}