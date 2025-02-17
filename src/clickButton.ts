import type { ElementHandle, Page } from "puppeteer"
import { getStudyProgramList } from "./utility"

export async function clickStudyProgram(page: Page, index: number) {
    const li = (await getStudyProgramList(page))[index]
    await Promise.all([
        await li.click(),
        await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}

export async function clickSubmitButton(page: Page) {
    const button = await page.$$(".navt-btn, .submit-button")
    await Promise.all(
        [
            await button[0].click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export async function clickFinishButton(page: Page) {
    const button = await page.$(".btn-area.clearfix.no-interval > li.right > input.navy-btn")
    if (!button) {
        const button2 = await page.$(".btn-area.clearfix.no-interval > li.right > i > input.navy-btn")
        if (!button2) throw Error("buttonが存在しません!");
        await Promise.all(
            [
                await button2.click(),
                await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
            ]
        )
        return
    }
    await Promise.all(
        [
            await button.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export async function clickLeftButton(page: Page) {
    const leftButton = await page.$(".left")
    if (!leftButton) throw new Error("leftButtonが見つかりません!");
    await Promise.all(
        [
            await leftButton.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

export async function clickTask(page: Page, task: ElementHandle<HTMLElement>) {
    await Promise.all(
        [
            await task.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}
