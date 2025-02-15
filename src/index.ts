import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, clickStudyProgram, clickSubmitButton, wait, clickFinishButton } from "./utility"
import { getAnswerForSelection, isSelection, setAnswerForSelection } from "./answerForSelection";
import { isSelf, setAnswerForSelf } from "./answerForSelf";
import { getAnswerForListSelection, isListSelection, setAnswerForList } from "./answerForListSelection";
import { getAnswerForInput, isInput, setAnswerForInput } from "./answerForInput";
import { getAnswerForMultiInput, isMultiInput, setAnswerForMultiInput } from "./answerForMultiInput";


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

async function getAnswerType(page: Page) {
    if (await isSelf(page)) return "self";
    if (await isSelection(page)) return "selection";
    if (await isInput(page)) return "input";
    if (await isMultiInput(page)) return "multiinput";
    if (await isListSelection(page)) return "listselection";
}

interface AnswerData {
    number: number,
    string: string,
    strings: string[]
}

async function runClassi(page: Page) {
    const listLength = (await getStudyProgramList(page)).length

    for (let i = 9; i < listLength; i++) {
        const list = await getStudyProgramList(page)
        if (await isStudyPrograms(list[i])) {

            await clickStudyProgram(page, i)
            await wait()

            const answerType = await getAnswerType(page)
            await clickSubmitButton(page)
            await wait()

            const answer: AnswerData = {
                number: 0,
                string: "",
                strings: []
            }

            //答えをゲットする処理
            try {
                switch (answerType) {
                    case "self": {
                        await setAnswerForSelf(page)
                        break;
                    }
                    case "input": {
                        answer.string = await getAnswerForInput(page)
                        break;
                    }
                    case "listselection": {
                        answer.strings = await getAnswerForListSelection(page)
                        break;
                    }
                    case "multiinput": {
                        answer.strings = await getAnswerForMultiInput(page)
                        break;
                    }
                    case "selection": {
                        answer.number = await getAnswerForSelection(page)
                        break;
                    }
                }
            } catch (error) {
                console.log(error)
            }
            await wait()

            await clickFinishButton(page)
            await wait()

            if (answerType === "self") {
                continue
            }

            await clickStudyProgram(page, i)
            await wait()


            //答えをセットする処理
            try {
                switch (answerType) {
                    case "input": {
                        await setAnswerForInput(page, answer.string)
                        break;
                    }
                    case "listselection": {
                        await setAnswerForList(page, answer.strings)
                        break;
                    }
                    case "multiinput": {
                        await setAnswerForMultiInput(page, answer.strings)
                        break;
                    }
                    case "selection": {
                        await setAnswerForSelection(page, answer.number)
                        break;
                    }
                }
            } catch (error) {
                console.log(error)
            }
            await wait()

            await clickSubmitButton(page)
            await wait()

            await clickFinishButton(page)
            await wait()
        }
    }
}




main()