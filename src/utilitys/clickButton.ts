import type { ElementHandle, Page } from "puppeteer-core"
import { getStudyPrograms } from "./utility"

export async function waitForTransition<T extends Element>(page: Page, element: ElementHandle<T>) {
    await Promise.all([
        await element.click(),
        await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}

export async function clickStudyProgram(page: Page, index: number) {
    const li = await getStudyPrograms(page)
    await waitForTransition(page, li[index])
}

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