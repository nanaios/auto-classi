import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, clickStudyProgram, clickSubmitButton, wait, clickFinishButton, clickLeftButton, clickTask, getStudyProgramName, getTaskName } from "./utility"
import { getAnswerForSelection, isSelection, setAnswerForSelection, setRandomAnswerForSelection } from "./answerForSelection";
import { isSelf, setAnswerForSelf } from "./answerForSelf";
import { getAnswerForListSelection, isListSelection, setAnswerForList, setRandomAnswerForList } from "./answerForListSelection";
import { getAnswerForInput, isInput, setAnswerForInput } from "./answerForInput";
import { getAnswerForMultiInput, isMultiInput, setAnswerForMultiInput } from "./answerForMultiInput";


async function main() {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222'
    });
    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();

    console.log("autoClassiを起動しました")

    console.log(`${(await page.title())}に接続しました`)
    await wait()
    await runTasks(page)

    console.log("autoClassiを終了します")
    process.exit(0)
}

async function runTasks(page: Page) {
    const tasksLength = (await page.$$(".task-list > a")).length

    console.log(`合計講義数：${tasksLength}個`)

    for (let i = 0; i < tasksLength; i++) {
        const tasks = await page.$$(".task-list > a")
        const taskName = await getTaskName(tasks[i])
        console.log(`\n講義[name:${taskName}]の処理を開始`)

        await clickTask(page, tasks[i])
        await wait()

        await runClassi(page)
        await wait()

        await clickLeftButton(page)
        console.log(`\n講義[name:${taskName}]の処理を終了`)
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

    for (let i = 0; i < listLength; i++) {
        const list = await getStudyProgramList(page)
        if (await isStudyPrograms(list[i])) {

            const name = await getStudyProgramName(list[i])
            console.log(`\n設問[name:${name}]の解答を開始`)

            await clickStudyProgram(page, i)
            await wait()

            const answerType = await getAnswerType(page)
            console.log(`問題タイプ：${answerType}`)

            try {
                switch (answerType) {
                    case "listselection": {
                        await setRandomAnswerForList(page)
                        break;
                    }
                    case "selection": {
                        await setRandomAnswerForSelection(page)
                        break;
                    }
                }
            } catch (error) {
                console.log(error)
            }
            await wait()

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

            if (answerType === "self") {
                await clickFinishButton(page)
                console.log(`設問[name:${name}]の解答を終了`)
                await wait()
                continue
            }

            await clickFinishButton(page)
            await wait()

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
            console.log(`設問[name:${name}]の解答を終了`)
            await wait()
        }
    }
}




main()