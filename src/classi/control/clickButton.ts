import { waitForTransition } from "@/utilitys/utility"
import type { Page } from "puppeteer"

export async function clickSubmitButton(page: Page) {
    const button = await page.$$(".navt-btn, .submit-button")
    await waitForTransition(page, button[0])
}

export async function clickFinishButton(page: Page) {
    const button = await page.$(".btn-area.clearfix.no-interval > li.right > input.navy-btn")
    if (!button) {
        const button2 = await page.$(".btn-area.clearfix.no-interval > li.right > i > input.navy-btn")
        if (!button2) throw Error("buttonが存在しません!");
        await waitForTransition(page, button2)
    } else {
        await waitForTransition(page, button)
    }
}

export async function clickLeftButton(page: Page) {
    const leftButton = await page.$(".left")
    if (!leftButton) throw new Error("leftButtonが見つかりません!");
    await waitForTransition(page, leftButton)
}

export async function clickStartAssignmentButton(page: Page) {
    const button = await page.$("li.right")
    if (!button) throw new Error("buttonが存在しません!");
    await waitForTransition(page, button)
}