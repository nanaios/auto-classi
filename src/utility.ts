import type { ElementHandle, Page } from "puppeteer";

let isDetailedLog = false
DEV: isDetailedLog = true

export async function getElement<S extends string>(parent: Page | ElementHandle<Element>, selector: S) {
    const element = await parent.$(selector)
    if (!element) throw new Error(`セレクター[${selector}]にマッチする要素がありません`);
    return element
}

export function detailedLog(data: any) {
    if (isDetailedLog) {
        console.log(data)
    }
}