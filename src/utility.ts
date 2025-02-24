import { ElementHandle, Page } from "puppeteer";

let isDetailedLog = false
DEV: isDetailedLog = true

export async function getElement<S extends string>(parent: Page | ElementHandle<Element>, selector: S) {
    const element = await parent.$(selector)
    if (!element) throw new Error(`セレクター[${selector}]にマッチする要素がありません`);
    return element
}

export async function waitForClickTransition(page: Page, element: ElementHandle<HTMLElement>) {
    await Promise.all([
        element.click(),
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2', 'domcontentloaded'] })
    ])
    await wait()
}

export function detailedLog(data: any) {
    if (isDetailedLog) {
        console.log(data)
    }
}

export async function wait(ms: number = 500) {
    return new Promise<void>(res => {
        const id = setTimeout(() => {
            clearTimeout(id)
            res()
        }, ms)
    })
}

export async function isSolved(element: ElementHandle<HTMLElement>) {
    const mark = await element.$(".check-mark")
    return mark !== null
}

export async function goBack(page: Page) {
    await page.goBack({ waitUntil: ['load', 'networkidle2', 'domcontentloaded'] })
    await wait()
}