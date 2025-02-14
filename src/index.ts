import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, clickStudyProgram, clickSubmitButton, wait } from "./utility"
import { answerForSelection, isSelection } from "./answerForSelection";
import { answerForSelf, isSelf } from "./answerForSelf";
import { anserForListSelection } from "./answerForListSelection";


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
            } else {
                await anserForListSelection(page, i)
            }
            await wait()
        }
    }
    return 0
}




main()