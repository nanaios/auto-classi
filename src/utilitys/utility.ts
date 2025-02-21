import type { Page, ElementHandle } from "puppeteer-core";
import { arg } from "@/classi";

export function wait(ms: number = arg.wait) {
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

export function random(max: number) {
    return Math.floor(Math.random() * max);
}

export async function copyPage(page: Page) {
    const copy = await page.browser().newPage()
    await copy.goto(page.url(), { waitUntil: ['load', 'networkidle2'] })
    return copy
}

export async function isCorrectProgram(list: ElementHandle<HTMLElement>) {
    if (arg.dev) return false
    const correctIconSrc = await list.$eval("a > p > img", img => img.src)
    return !(correctIconSrc.includes("incorrect"))
}

export async function isChecked(list: ElementHandle<HTMLElement>) {
    if (arg.dev) return false
    const chekeMark = await list.$(".check-mark")
    return Boolean(chekeMark)
}

export async function waitForTransition<T extends Element>(page: Page, element: ElementHandle<T>) {
    await Promise.all([
        await element.click(),
        await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}
