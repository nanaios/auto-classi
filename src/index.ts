import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, clickStudyProgram, clickSubmitButton, wait } from "./utility"
import { anserForSelection } from "./answerForSelection";
import { answerForSelf, isSelf } from "./answerForSelf";


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
    await wait(1000)

    return 0
    const listLength = (await getStudyProgramList(page)).length

    for (let i = 0; i < listLength; i++) {
        const list = (await getStudyProgramList(page))[i]
        if (await isStudyPrograms(list)) {
            await clickStudyProgram(page, i)
            await wait(1000)
            await clickSubmitButton(page)
            await wait(1000)
            if (await isSelf(page)) {
                await answerForSelf(page)
            } else {
                await anserForSelection(page, i)
            }
            await wait(1000)
        }
    }
    return 0
}




main()