import type { ElementHandle, Page } from "puppeteer";
import { isVideoContent } from "./video";
import { isStudyContent, solveStudyContent } from "./study";

async function getContentName(element: ElementHandle<HTMLElement>) {
    return element.$eval("a", a => a.innerText)
}

async function* getContents(page: Page) {
    const contents = await page.$$("li.flow-single.student")
    console.log(`合計要素数:${contents.length}`)
    let i: number
    for (i = 0; i < contents.length; i++) {
        const contents = await page.$$("li.flow-single.student")
        yield contents[i]
    }
}

async function solveContent(page: Page, content: ElementHandle<HTMLElement>) {
    const name = await getContentName(content)
    console.log(`\n要素[name:${name}]の解答を開始`)
    if (await isVideoContent(content)) {

    } else if (await isStudyContent(content)) {
        await solveStudyContent(page, content)
    }
    console.log(`要素[name:${name}]の解答を終了\n`)
}

export async function solveContents(page: Page) {
    for await (const content of getContents(page)) {
        //要素の解答を開始
        await solveContent(page, content)
    }
}