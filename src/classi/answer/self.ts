import type { Page } from "puppeteer";

export async function setSelfAnswer(page: Page, collect: boolean) {
    const radio = await page.$$("input[type=radio]")
    if (collect) {
        await radio[0].click()
    } else {
        await radio[1].click()
    }
}