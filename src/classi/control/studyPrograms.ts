import type { Page, ElementHandle } from "puppeteer"

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


export async function getStudyProgramName(list: ElementHandle<HTMLElement>) {
    const name = await list.$eval("a", element => element.innerText)
    return name
}