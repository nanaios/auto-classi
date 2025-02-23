import type { Page } from "puppeteer";

export async function isList(page: Page) {
    const check = await page.$("div.image-select-box")
    return check !== null
}

async function getSelectLists(page: Page) {
    return page.$$("div.image-select-box")
}