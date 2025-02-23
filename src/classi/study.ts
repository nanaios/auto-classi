import { wait, waitForClickTransition } from "@/utility";
import type { ElementHandle, Page } from "puppeteer";

export async function isStudyContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-pencil-square-o")
    return mark !== null
}

export async function solveStudyContent(page: Page, content: ElementHandle<HTMLElement>) {
    await waitForClickTransition(page, content)
    await wait()
}