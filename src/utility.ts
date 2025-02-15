import type { Page, ElementHandle } from "puppeteer";

const BASE_WAIT_TIME = 500

export async function getStudyProgramList(page: Page) {
    const lilsts = await page.$(".spen-mod-item-list.is-column-1.spen.spen-util-mb-24.lecture-flow")
    if (!lilsts) throw Error("listsがありません!!");
    return lilsts.$$("li")
}

export async function isStudyPrograms(list: ElementHandle<HTMLElement>) {
    const icon = await list.$(".fa-pencil-square-o")
    return Boolean(icon)
}

export async function getStudyProgramName(list: ElementHandle<HTMLElement>) {
    const name = await list.$eval("a", element => element.innerText)
    return name
}

export async function clickStudyProgram(page: Page, index: number) {
    const li = (await getStudyProgramList(page))[index]
    await Promise.all([
        await li.click(),
        await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}

export async function clickSubmitButton(page: Page) {
    const button = await page.$$(".navt-btn, .submit-button")
    await Promise.all(
        [
            await button[0].click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export async function clickFinishButton(page: Page) {
    const button = await page.$(".btn-area.clearfix.no-interval > li.right > input.navy-btn")
    if (!button) throw Error("buttonが存在しません!");
    await Promise.all(
        [
            await button.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export function wait(ms: number = BASE_WAIT_TIME) {
    return new Promise<void>(res => {
        const id = setTimeout(() => {
            clearTimeout(id)
            res()
        })
    })
}

export function formatClassiAns(rawAns: string) {
    return rawAns.replace(/\n/g, "").replace(/\t/g, "").split("(")[0].trim()
}

export async function getTaskName(task: ElementHandle<HTMLElement>) {
    const label = await task.$eval(".simple-task-name > p > span.lecture_name", element => element.innerText)
    return label
}

export async function clickLeftButton(page: Page) {
    const leftButton = await page.$(".left")
    if (!leftButton) throw new Error("leftButtonが見つかりません!");
    await Promise.all(
        [
            await leftButton.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export async function clickTask(page: Page, task: ElementHandle<HTMLElement>) {
    await Promise.all(
        [
            await task.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export function random(max: number) {
    return Math.floor(Math.random() * max);
}