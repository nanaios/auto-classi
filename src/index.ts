import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, clickStudyProgram, clickSubmitButton, wait } from "./utility"
import { answerForSelection, isSelection } from "./answerForSelection";
import { answerForSelf, isSelf } from "./answerForSelf";
import { anserForListSelection } from "./answerForListSelection";
import { answerForInput, isInput } from "./answerForInput";
import { answerForMultiInput, isMultiInput } from "./answerForMultiInput";


async function main() {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();
    console.log(`${(await page.title())}に接続しました。`)
    await wait()
    await runTasks(page)

    process.exit(0)
}

async function runTasks(page: Page) {
    const tasksLength = (await page.$$(".task-list > a")).length

    for (let i = 0; i < tasksLength; i++) {
        const tasks = await page.$$(".task-list > a")
        await wait()
        await Promise.all(
            [
                await tasks[i].click(),
                await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
            ]
        )
        await wait()

        await runClassi(page)
        await wait()

        const leftButton = await page.$(".left")
        if (!leftButton) throw new Error("leftButtonが見つかりません!");
        await Promise.all(
            [
                await leftButton.click(),
                await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
            ]
        )
        await wait()
    }
}


async function runClassi(page: Page) {
    const listLength = (await getStudyProgramList(page)).length

    for (let i = 0; i < listLength; i++) {
        const list = (await getStudyProgramList(page))[i]
        if (await isStudyPrograms(list)) {
            await clickStudyProgram(page, i)
            await wait()
            await clickSubmitButton(page)
            await wait()
            if (await isSelf(page)) {
                await answerForSelf(page)
            } else if (await isSelection(page)) {
                await answerForSelection(page, i)
            } else if (await isInput(page)) {
                await answerForInput(page, i)
            } else if (await isMultiInput(page)) {
                await answerForMultiInput(page, i)
            } else {
                await anserForListSelection(page, i)
            }
            await wait()
        }
    }
}




main()