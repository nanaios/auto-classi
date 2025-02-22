import type { Page, ElementHandle } from "puppeteer";
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
        element.click(),
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}

export function checkElement<T extends HTMLElement>(element: ElementHandle<T> | null) {
    if (element) {
        return element
    } else {
        throw new Error("elementが存在しません")
    }
}

export function log(msg: string) {
    if (arg.log || arg.dev) {
        console.log(msg)
    }
}