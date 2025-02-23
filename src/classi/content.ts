import type { ElementHandle, Page } from "puppeteer";

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

export async function solveContents(page: Page) {
    for await (const content of getContents(page)) {
        const name = await getContentName(content)
        console.log(`要素[name:${name}]の解答を開始`)
    }
}