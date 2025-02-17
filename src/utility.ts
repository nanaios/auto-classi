import type { Page, ElementHandle } from "puppeteer";

const BASE_WAIT_TIME = argToNumber(1) ?? 500
console.log(`デフォルトの待機時間:${BASE_WAIT_TIME}`)

export const isDev = process.argv[process.argv.length - 1] === "dev"
if (isDev) {
    console.log("開発者モード状態に移行しました")
}

export async function getStudyProgramList(page: Page) {
    const lilsts = await page.$(".spen-mod-item-list.is-column-1.spen.spen-util-mb-24.lecture-flow")
    if (!lilsts) throw Error("listsがありません!!");
    return lilsts.$$("li")
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

export async function getTaskName(task: ElementHandle<HTMLElement>) {
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

export function argToNumber(index: number) {
    const arg = Number(process.argv[index + 2])
    if (Number.isNaN(arg)) {
        return undefined
    } else {
        return arg
    }
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