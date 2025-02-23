import type { Page } from "puppeteer";

export async function isCheckBox(page: Page) {
    const check = await page.$(".selectors-preview-list")
    return check !== null
}